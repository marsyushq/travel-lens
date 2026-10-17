import { IoMdInformationCircle } from 'react-icons/io';
import { lazy, Suspense } from 'react';
import Popup from 'reactjs-popup';
import '../styles/InfoPopup.css';

const PopupContent = lazy(() => import('./PopupContent'));

export default function InfoPopup(){
  /**
    * referred to https://react-icons.github.io/react-icons/search/#q=info
    * and https://www.geeksforgeeks.org/reactjs/how-to-create-popup-box-in-reactjs/
    */
  return (
    <div className="info-popup">
      <Popup
        trigger={
          <button className="info-button">
            <IoMdInformationCircle className="info-icon" />
          </button>
        }
        position="bottom left"
        closeOnDocumentClick
        arrow={false}   
      >
        <Suspense fallback={<div> Loading guide ...</div>}>
          <PopupContent/>
        </Suspense>
      </Popup>
    </div>
  );
}