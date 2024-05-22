import React, { useState } from 'react';
import './App.css';
import Header from './components/header/navbar.jsx';

function App() {
  const [diameter, setDiameter] = useState(null);
  const [Weightofthecar, setWeightofthecar] = useState(null);
  const [Lengthofthecar, setLengthofthecar] = useState(null);
  const [widthofthecar, setwidthofthecar ] = useState(null);
  const [Heightofthecar, setHeightofthecar] = useState(null);
  const [GroundClearance, setGroundClearance] = useState(null);
  const [WheelBase, setWheelBase] = useState(null);
  const [TensileStrength, setTensileStrength] = useState(null);
  const [ShearStrength, setShearStrength] = useState(null);


  const [stepwiseCalculations, setStepwiseCalculations] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      // Get form values and parse them as numbers
      const Weightofthecar = parseFloat(event.target.elements.Weightofthecar.value);
      setWeightofthecar(Weightofthecar);
      const Lengthofthecar = parseFloat(event.target.elements.Lengthofthecar.value);
      setLengthofthecar(Lengthofthecar);
      const widthofthecar = parseFloat(event.target.elements.widthofthecar.value);
      setwidthofthecar(widthofthecar);
      const Heightofthecar = parseFloat(event.target.elements.Heightofthecar.value);
      setHeightofthecar(Heightofthecar);
      const WheelBase = parseFloat(event.target.elements.WheelBase.value);
      setWheelBase(WheelBase);
      const GroundClearance = parseFloat(event.target.elements.GroundClearance.value);
      setGroundClearance(GroundClearance);
      const TensileStrength = parseFloat(event.target.elements.TensileStrength.value);
      setTensileStrength(TensileStrength);
      const ShearStrength = parseFloat(event.target.elements.ShearStrength.value);
      setShearStrength(ShearStrength);
      // Calculate eccentricity
      const eccentricity = widthofthecar / 2 + 600;
  
      // Calculate equivalent torque
      const torqueStep1 = Math.pow(0.25 * Weightofthecar * eccentricity, 2);
      const torqueStep2 = Math.pow(2 * Weightofthecar * 50, 2);
      const tauEq = Math.sqrt(torqueStep1 + torqueStep2);
  
      // Calculate diameter
      const diameterStep1 = 16 * tauEq;
      const diameterStep2 = Math.PI * ShearStrength;
      const calculatedDiameter = Math.pow(diameterStep1 / diameterStep2, 1 / 3);
  
      // Update state with calculated diameter
      setDiameter(calculatedDiameter);
  
      // Update state with stepwise calculations
      setStepwiseCalculations({
        torque: {
          step1: torqueStep1,
          step2: torqueStep2,
          result: tauEq
        },
        diameter: {
          step1: diameterStep1,
          step2: diameterStep2,
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

      <div className='intro-container'>
      <p className='intro-para'>This expert system is designed specifically for the purpose of performing design calculations for an automotive lift intended to raise a car.
         
By providing key specifications of the car - such as weight, dimensions, wheel base and lifting points - this system will perform all necessary design calculations and deliver detailed dimensions for each component of the lift.
 
The system ensures that all elements, from the lift mechanisms to the structural framework and safety features, are precisely calculated to meet engineering standards and safety requirements.

Please provide the following specifications of the car for which you want to design a lift :</p></div>
      <form onSubmit={handleSubmit}>
  <h1>Input Parameters</h1>
  <label htmlFor="Weightofthecar">Weight of the car(N):</label>
  <input type="number" id="Weightofthecar" name="Weightofthecar" /><br />

  <label htmlFor="Lengthofthecar">Length of the car(mm):</label>
  <input type="number" id="Lengthofthecar" name="Lengthofthecar" /><br />

  <label htmlFor="widthofthecar">width of the car (mm):</label>
  <input type="number" id="widthofthecar" name="widthofthecar" /><br />

  <label htmlFor="Heightofthecar">Height of the car (mm):</label>
  <input type="number" id="Heightofthecar" name="Heightofthecar" /><br />

  <label htmlFor="WheelBase">Wheel Base (mm):</label>
  <input type="number" id="WheelBase" name="WheelBase" /><br />

  <label htmlFor="GroundClearance">Ground Clearance (mm):</label>
  <input type="number" id="GroundClearance" name="GroundClearance" /><br />
  
  <label htmlFor="TensileStrength">Tensile Strength of material chosen (MPa):</label>
  <input type="number" id="TensileStrength" name="TensileStrength" /><br />

  <label htmlFor="ShearStrength">Shear Strength of material chosen (MPa):</label>
  <input type="number" id="ShearStrength" name="ShearStrength" /><br />

  <input type="submit" value="Submit" id='calculate-diameter' />
</form>
  
        {stepwiseCalculations && (
          <div className='calculations'>
           
            <h2>1. Design of Screw</h2>
            <h3>Equivalent Torque:</h3>
            <ul>
              <li><b>Step 1 : </b>(0.25 * {(Weightofthecar/2)+600} * {Weightofthecar})<sup>2</sup> = {stepwiseCalculations.torque.step1.toFixed(2)}</li>
              <li><b>Step 2 : </b>(2 * {Math.pow(Math.pow(0.25*Weightofthecar*(widthofthecar/2+600),2) +Math.pow(2*Weightofthecar*50,2),0.5).toFixed(2)})<sup>2</sup> = {stepwiseCalculations.torque.step2.toFixed(2)}</li>
              <li><b>Result : </b><span className="underroot">√ (step1 + step2)</span> = {stepwiseCalculations.torque.result.toFixed(2)} N-mm</li>
            </ul>
            <h3>Diameter:</h3>
            <ul>
              <li><b>Step 1 : </b> 16 * Equivalent Torque = {stepwiseCalculations.diameter.step1.toFixed(2)}</li>
              <li><b>Step 2 : </b> pi * {ShearStrength} = {stepwiseCalculations.diameter.step2.toFixed(2)}</li>
              <li><b>Result : </b>(step 1/step 2)<sup>(1/3)</sup> = {stepwiseCalculations.diameter.result.toFixed(2)} mm</li>
              <li>{diameter && <p id="result">Final diameter of the screw : {diameter.toFixed(2)} mm</p>}</li>
              <li><b>Note:</b> Other specifications of the screw should be taken from PSG design data book.</li>
            </ul>
          <h2>2.Drive Chain</h2>
          <p>Since Velocity Ratio = 1 = N<sub>1</sub>/N<sub>2</sub>
          <br/>From PSG Design Data Book-
<br/>No. of tooth on smaller sprocket = T<sub>1</sub> = 31
<br/>No. of tooth on larger sprocket = T<sub>2</sub> = T1 x N<sub>1</sub>/N<sub>2</sub> = 31*1 =31

<br/>For chain drive,
<br/>Designed Power = Rated Power x Service Factor
<br/>service factor = K<sub>s</sub> = K<sub>1</sub> x K<sub>2</sub> x K<sub>3</sub> x K<sub>4</sub> x K<sub>5</sub> x K<sub>6</sub>
<br/>Here, from PSG  Data Book
<br/>K<sub>1</sub> = 1.25 Load factor for variable load with mild shock
<br/>K<sub>2</sub> = 1.25, Factor for distance regulation, for fixed centre distance.
<br/>K<sub>3</sub>= 0.8, Factor for centre distance, C
<br/>K<sub>4</sub>= 1.0, Factor for position of sprocket, for horizontal drive.
<br/>K<sub>5</sub> = 1.5, Lubrication factor, for periodic lubrication
<br/>K<sub>6</sub> = 1.0, Rating factor for 8 hr/day.
<br/>Service Factor K<sub>s</sub> = 1.875
<br/>Designed Power = 1.875 x 2.25 = 4.218 KW
<br/>From PSG Design Data Book-
<br/>For pinion speed of 200 rpm the power transmitted by chain 10B is 2.19KW
<br/>From PSG Design Data Book- 
<br/>For chain no. 10B important dimension are:
<br/>Pitch (p) = 15.875 mm
<br/>Roller diameter d<sub>1</sub> = 10.16 mm
<br/>Width b/w inner plates b<sub>1</sub> = 9.65 mm
<br/>Transverse pitch P<sub>t</sub>= 16.59 mm
<br/>Breaking load for simplex chain = 22.2 KN
<br/>Now,
<br/>Pitch circle diameter of sprocket D<sub>1</sub> = p.cosec(180/T) = 157.13 mm
<br/>Pitch line velocity (V) = 1.643 m/s
<br/>Load on chain W = Rated Power /Pitch line velocity = 2.25/1.643 = 1.369 KN
<br/>Factor of safety f = Breaking load/Load on chain = WB/W = 22200/1369 = 16.2
<br/>This value is more than given in table which is 7.8
<br/>The minimum centre distance between sprockets must be 30 to 50 times pitch.
<br/>Centre distance between sprockets is 2.5m = 2500 mm
<br/>Length of chain L= K<sub>p</sub> = 15.875 × 346 = 5492mm ~ 5.5 m
<br/><b>FINAL DIMENSIONS OF CHAIN:</b>
<br/>Chain No. I.S. 10B single strand
<br/>Pitch p = 15.875 mm
<br/>Roller dia D<sub>r</sub> = 10.16 mm
<br/>Width between inner plates (b<sub>1</sub>) = 9.65 mm
<br/>Breaking load Q = 22.2 KN
<br/>No. of teeth on sprockets N =31
<br/>Pitch circle dia of sprocket D<sub>1</sub>= 157.13 mm
<br/><b>Length of chain L = 346 Pitch = 5.5 m</b></p>


          </div>
        )}
      </div>
    </div>
  );
}

export default App;
