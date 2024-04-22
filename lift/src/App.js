import React, { useState } from 'react';
import './App.css';
import Header from './components/header/navbar.jsx';

function App() {
  const [diameter, setDiameter] = useState(null);
  const [originalTorque, setOriginalTorque] = useState(null);
  const [weightLifted, setWeightLifted] = useState(null);
  const [eccentricity , setEccentricity ] = useState(null);
  const [maxShearStress, setMaxShearStress] = useState(null);
  const [stepwiseCalculations, setStepwiseCalculations] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      // Get form values and parse them as numbers
      const originalTorque = parseFloat(event.target.elements.originalTorque.value);
      setOriginalTorque(originalTorque);
      const weightLifted = parseFloat(event.target.elements.weightLifted.value);
      setWeightLifted(weightLifted);
      const eccentricity = parseFloat(event.target.elements.eccentricity.value);
      setEccentricity(eccentricity);
      const maxShearStress = parseFloat(event.target.elements.maxShearStress.value);
      setMaxShearStress(maxShearStress);

      // Import libraries for calculations
      const sqrt = Math.sqrt;
      const pi = Math.PI;

      // Equivalent torque calculation
      const torqueStep1 = Math.pow(0.25 * weightLifted * eccentricity, 2);
      const torqueStep2 = Math.pow(2 * originalTorque, 2);
      const tauEq = sqrt(torqueStep1 + torqueStep2);

      // Diameter calculation
      const diameterStep1 = 16 * tauEq;
      const diameterStep2 = pi * maxShearStress;
      const calculatedDiameter = Math.pow(diameterStep1 / diameterStep2, 1 / 3);

      // Update state with calculated diameter
      setDiameter(calculatedDiameter);

      // Update state with stepwise calculations
      setStepwiseCalculations({
        torque: {
          step1: (0.25 * weightLifted * eccentricity) ** 2 + (2 * originalTorque) ** 2,
          step2: (2 * originalTorque) ** 2,
          result: tauEq
        },
        diameter: {
          step1: 16 * tauEq,
          step2: pi * maxShearStress,
          result: calculatedDiameter
        }
      });
    } catch (error) {
      console.error("Error:", error);
      setDiameter(null);
      setStepwiseCalculations(null);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className='form'>
        <form onSubmit={handleSubmit}>
          <h1>Calculation for screws</h1>
          <label htmlFor="originalTorque">Original Torque (N-mm):</label>
          <input type="number" id="originalTorque" name="originalTorque" /><br />

          <label htmlFor="weightLifted">Weight Being Lifted (N):</label>
          <input type="number" id="weightLifted" name="weightLifted" /><br />

          <label htmlFor="eccentricity">Eccentricity (mm):</label>
          <input type="number" id="eccentricity" name="eccentricity" /><br />

          <label htmlFor="maxShearStress">Maximum Shear Stress (MPa):</label>
          <input type="number" id="maxShearStress" name="maxShearStress" /><br />

          <input type="submit" value="Calculate Diameter" id='calculate-diameter' />
        </form>
        {diameter && <p id="result">Calculated Diameter : {diameter.toFixed(2)} mm</p>}
        {stepwiseCalculations && (
          <div className='calculations'>
            <h2>Step-wise Calculations</h2>
            <h3>Equivalent Torque:</h3>
            <ul>
              <li><b>Step 1 : </b>(0.25 * {eccentricity} * {weightLifted})<sup>2</sup> = {stepwiseCalculations.torque.step1.toFixed(2)}</li>
              <li><b>Step 2 : </b>(2 * {originalTorque})<sup>2</sup> = {stepwiseCalculations.torque.step2.toFixed(2)}</li>
              <li><b>Result : </b><span className="underroot">√ (step1 + step2)</span> = {stepwiseCalculations.torque.result.toFixed(2)} N-mm</li>
            </ul>
            <h3>Diameter:</h3>
            <ul>
              <li><b>Step 1 : </b> 16 * Equivalent Torque = {stepwiseCalculations.diameter.step1.toFixed(2)}</li>
              <li><b>Step 2 : </b> pi * {maxShearStress} = {stepwiseCalculations.diameter.step2.toFixed(2)}</li>
              <li><b>Result : </b>(step 1/step 2)<sup>(1/3)</sup> = {stepwiseCalculations.diameter.result.toFixed(2)} mm</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
