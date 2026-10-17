import '../styles/InfoPopup.css';

export default function PopupContent() {
  return (
    <div className="popup-content">
      <h3> Quick Guide</h3>
      <section>
        <h4> Map </h4>
        <p> Click on any country on the map to see detailed visa information.</p>
      </section>
      <section>
        <h4> Filter </h4>
        <p>Use the filter on the right to display countries by visa type.</p>
        <ul>
          <li> Green: indicates visa-free status.</li>
          <li> Red: indicates visa-required status.</li>
          <li> Blue: indicates ETA visa-status.</li>
          <li> Yellow: indicates visa on arrival.</li>
          <li> Orange: indicates E-Visa status. </li>
        </ul>
      </section>
      <section>
        <h4> Statistics</h4>
        <p>The statistics panel displays the total number of countries for each visa type.</p>
      </section>
      <section>
        <h4> Country Details</h4>
        <p> Expanding the country details displays tourism information and safety index. </p>
      </section>
    </div>
  );
}
