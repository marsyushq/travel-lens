// import { from } from 'form-data';
import { MongoClient, ServerApiVersion } from 'mongodb';
import process from 'node:process';
//note: change it to ATLAS_URI_PROD, so it works with prod db
//.env at the root of the project!!
let instance = null;

class DB {
  constructor() {
    //instance is the singleton, defined in outer scope
    if (!instance) {
      instance = this;
      this.mongoClient = null;
      this.db = null;
      //stores all collection to avoid using setCollection every time
      //use db.collection[collectionName] to access a collection
      this.collection = {};
    }
    return instance;
  }

  async connect(dbName) {

    if(!process.env.ATLAS_URI){
      process.loadEnvFile('../.env');
    }

    if (instance.db) {
      return;
    }
    const dbUrl = process.env.ATLAS_URI;
    this.mongoClient = new MongoClient(dbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    await instance.mongoClient.connect();
    instance.db = await instance.mongoClient.db(dbName);
    //the names of the collections => refers to the datasets
    const names = ['safety_index', 'passport_index', 'tourism', 'geojson'];
    for (const name of names) {
      instance.collection[name] = instance.db.collection(name);
    }
    await instance.mongoClient.db(dbName).command({ ping: 1 });
  }
  //close connection 
  async close() {
    await instance.mongoClient.close();
    this.db = null;
    this.collection = {};
  }
  //read all data from any dataset
  async readAll(collectionName) {
    return await instance.collection[collectionName].find().toArray();
  }
  //add docs to a specific collection
  async createMany(collectionName, data) {
    return await instance.collection[collectionName].insertMany(data);
  }

  // to clear db before inserting data 
  async deleteMany(collectionName){
    return await instance.collection[collectionName].deleteMany({});
  }

  //get all countries where a visa status applies
  async getVisaInfo(iso, type) {
    return await instance.collection['passport_index'].find(
      { from: iso, requirement: { $elemMatch: { requirement: type } } } 
    ).toArray();
  }

  // get all visa info from a single country
  async getVisaDestinations(iso) {
    return await instance.collection['passport_index'].findOne({ from: iso });
  }

  // get count of visa status for a country
  async getVisaCount(iso){
    const visaData = await this.getVisaDestinations(iso);

    if (!visaData || !visaData.to) {
      return null;
    }

    const destinations = Object.entries(visaData.to);
    const counts = {
      'visaFree': destinations.filter(dest => dest[1] === 'visa free' || 
        parseInt(dest[1]) > 0).length,
      'visaRequired': destinations.filter(dest => dest[1] === 'e-visa').length,
      'eta': destinations.filter(dest => dest[1] === 'eta').length,
      'eVisa': destinations.filter(dest => parseInt(dest[1]) > 0).length,
      'visaOnArrival': destinations.filter(dest => dest[1] === 'visa on arrival').length
    };
    return counts;
  }
  
  // get all coordinates to display the map 
  async mapInitialization() {
    return await this.readAll('geojson');
  }
  // get tourism and safety data by iso code 
  async getDetails(iso) {
    const data = await this.collection['tourism'].aggregate([
      {
        //finds by iso in the tourism dataset 
        $match: { iso: iso }
      },
      {
        //creates a join based on country name 
        $lookup: {
          from: 'safety_index',
          localField: 'country',
          foreignField: 'country',
          as: 'safetyData',
        },
      },
      {
        //groups data 
        $group: {
          _id: '$iso',
          country: { $first: '$country' },
          years: { $push: { year: '$year', visitors: '$visitors' } },
          safety: { $first: { $arrayElemAt: ['$safetyData.safety_index', 0] } },
        }
      }
    ]).toArray();
    return data;
  }
}

export const db = new DB();
