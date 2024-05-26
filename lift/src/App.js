import React, { useState } from 'react';
import screw from './assets/screw.png';
import machineLayout from './assets/machineLayout.png';
import telescopicArms from './assets/telescopicArms.png';
import rollers from './assets/rollers.png';
import copyright from './assets/copyright.png';
import './App.css';
import Header from './components/header/navbar.jsx';

function App() {
  
  const [Weightofthecar, setWeightofthecar] = useState(null);
  const [Lengthofthecar, setLengthofthecar] = useState(null);
  const [widthofthecar, setwidthofthecar ] = useState(null);
  const [Heightofthecar, setHeightofthecar] = useState(null);
  const [GroundClearance, setGroundClearance] = useState(null);
  const [WheelBase, setWheelBase] = useState(null);
  const [TensileStrength, setTensileStrength] = useState(null);
  const [ShearStrength, setShearStrength] = useState(null);

  //props and states for calculation of components;

  const [diameter, setDiameter] = useState(null);
  const [MotorSpeed, setMotorSpeed] = useState(null);
  const [finalMotorPower, setFinalMotorPower] = useState(null);


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
       const eccentricity = widthofthecar / 2 + 800;
      
      // Calculate equivalent torque
      const originalTorque = Weightofthecar * 11.5;

      

     
      
      const torqueStep1 = Math.pow(0.25 * Weightofthecar * eccentricity, 2);
      const torqueStep2 = Math.pow(2 * originalTorque, 2);
      const tauEq = Math.sqrt(torqueStep1 + torqueStep2);
      
      // Calculate diameter
      const pi= Math.PI;
      const diameterStep1 = Math.PI * ShearStrength;
      const diameterStep2 = 16 * tauEq;

      const calculatedDiameter = Math.pow((diameterStep2 / diameterStep1), 1 / 3);
      setDiameter(calculatedDiameter);

      //calculate motor speed
      const N=200;
      const powerMotor = 4*originalTorque*pi*N /(60*1000000);
      const efficiency = 0.85;
      const finalMotorPower = powerMotor/efficiency;
      const f=50;
      const p=6;
      const syncSpeed = 120*f/p;      
      const s = 0.04; //4% slip
      const MotorSpeed = syncSpeed*(1-s);
      setFinalMotorPower(finalMotorPower);
      setMotorSpeed(MotorSpeed);
  
      //calculation of belt 
      const reductionRatio = MotorSpeed/N;
      const D1=125;
      const W1= 2*pi* MotorSpeed/60;
      const D2 = D1 * reductionRatio;
      const speedBelt = D1 * W1/(2*1000) ;
      const fb=1.14; //diafactor
      const d0=D1*fb;   // equivalent pitch 
      const PowerTransmitted= ((0.79*Math.pow(speedBelt,-0.09)) - (50.8/d0) - (1.32* Math.pow(10,-4)*Math.pow(speedBelt,2)))*speedBelt; //by single belt
      const fa=1,fc=1,fd=0.85;
      const NumBelt = (finalMotorPower* fa)/(fc * fd *PowerTransmitted);

      //calculation of pulleys 
      const Dp1 =125;  // pully pitch dia
      const lk= 32; //length of the key 

      //smaller pulley

      //1. rim design 
      
      const ts = 0.35 * Math.sqrt(Dp1 + 5); // depth of the rim (mm)

      //2. length of hub 
      const lh = lk;  //length of hub (mm)

      //3. rib design 
      const t1= originalTorque/ 344323;   // thickness of rib (mm)

      //bigger pulley
      //Rim design 
      const Dp2 =315; // pitch diameter (mm)
      const tb = 0.35 * Math.sqrt(Dp2 + 5);

      //Telescopic arms and carriage
      const b = Math.pow((16.5 * Math.pow(10,5) * 3) / (2 * ShearStrength),1/3)
      const d=2*b;
      const di= Math.pow((2 * 5500 * 1150 * 32) / (pi * ShearStrength * 12),1/3)
     

      // Update state with stepwise calculations
      setStepwiseCalculations({
        torque: {
          step1: torqueStep1,
          step2: torqueStep2,
          step3:originalTorque,
          result: tauEq
          
        },
        diameter: {
          step1: diameterStep1,
          step2: diameterStep2,
          result: calculatedDiameter
        },
        Motor: {
          step1:powerMotor, 
          step2:finalMotorPower,
          step3:syncSpeed,
          step4:MotorSpeed},
        belt:{
          step1:D1,
          step2:D2,
          step3:speedBelt,
          step4:PowerTransmitted,
          step5:NumBelt,
          step6:reductionRatio,
          step7:d0
        },
        pulley :{
          step1:D1,
          step2: lh,
          step3:ts,
          step4:t1,
          step5:lk,
          step6:D2,
          step7:tb,
          step8:Dp1,
          step9:Dp2,
        },
        arms:{
          step1:b,
          step2:d,
          step3:di
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
      
     
      <div className='main-container'>

      <div className='intro-container'>
      <p className='intro-para'>This expert system is designed specifically for the purpose of performing design calculations for an automotive lift intended to raise a car.
         
      By providing key specifications of the car - such as weight, dimensions, wheel base and lifting points- this system will perform all necessary design calculations and deliver detailed dimensions for each component of the lift.
 
      The system ensures that all elements, from the lift mechanisms to the structural framework and safety features, are precisely calculated to meet engineering standards and safety requirements.

      <br/><br/>Please provide the following specifications of the car for which you want to design a lift:</p></div>

      <div className='form-container'>
      <h1>Input Parameters</h1>
      <form onSubmit={handleSubmit}>
      
      <label htmlFor="Weightofthecar">Weight of the car (N):</label>
      <input type="number" id="Weightofthecar" name="Weightofthecar" /><br />

      <label htmlFor="Lengthofthecar">Length of the car (mm):</label>
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
      <div id='button'>
      <input type="submit" value="Submit" id='calculate-button' />
      </div>
      
      </form>
      
      </div>
  
         {stepwiseCalculations && ( 
          <div className='calculations'>
            <div className='cal-container'>
            <h2>1. Design of Screw</h2>
            <h3>A. Equivalent Torque:</h3>
            <ul>
              <li>Using maximum shear stress theory</li>
              <li>Equivalent Torque = <span className="underroot"><span className='square-root'>√ </span>(0.25 x Weight Of The Car x Eccentricity)<sup>2</sup>+ (2 x Original Torque )<sup>2</sup></span></li>
              <li>Eccentricity = Width Of The Car / 2 + 600 = {widthofthecar}/2+ 600 = {(Weightofthecar/2)+600}</li>
              <li>Original Torque = Weight Of The Car x r = {Weightofthecar} x 50 = {stepwiseCalculations.torque.step3} N-mm</li>
              <li>Equivalent Torque = <span className='underroot'><span className='square-root'>√ </span>(0.25 * {Weightofthecar} * {(Weightofthecar/2)+600})<sup>2</sup> + (2 x  {stepwiseCalculations.torque.step3})<sup>2</sup></span> </li>
              <li><span className='result'>Result : Equivalent Torque = {stepwiseCalculations.torque.result.toFixed(2)} N-mm</span></li>
              
            </ul>
            <h3>B. Diameter:</h3>
            <ul>
              <li>Diameter = (16 x Torque / pi x Shear Strength)<sup>1/3</sup></li>
              <li>Step 1 : 16 x Torque = {stepwiseCalculations.diameter.step1.toFixed(2)}</li>
              <li>Step 2 : pi x {ShearStrength} = {stepwiseCalculations.diameter.step2.toFixed(2)}</li>
              <li>Step 3 : (step 1/step 2)<sup>(1/3)</sup> = {stepwiseCalculations.diameter.result.toFixed(2)} mm</li>
              <li><span className='result'>Result : Final diameter of the screw : {diameter.toFixed(2)} mm</span></li>
              <li><b>Note:</b> Other specifications of the screw should be taken from PSG design data book.</li>
              <li></li>
            </ul>
            <div className='img-container'><img src={screw} alt="screw" className='screw'/>
            <p><b>Figure 1: Screw</b></p>
            </div>
            </div>
            <div className='cal-container'>
            <h2>2. Motor Selection</h2>
            <ul>
              <li>Power to be transmitted by the motor - </li>
              <li>Motor Power (p')= 4 x Torque x Pi x N / 60 = 4 x {stepwiseCalculations.torque.result.toFixed(2)} x Pi x 60 / 60  = {stepwiseCalculations.Motor.step1.toFixed(2)} kW</li>
              <li>Considering overall efficiency of motor as 85 % </li>
              <li>Final Motor Power (P) = P' / 0.85 = {stepwiseCalculations.Motor.step2.toFixed(2)} kW</li>
              <li>Synchronous Speed = 120 x f / p = 120 x 50 / 6 =  {stepwiseCalculations.Motor.step3.toFixed(2)} rpm </li>
              <li>Motor Speed = Synchronous Speed x (1- slip factor) = {stepwiseCalculations.Motor.step3.toFixed(2)} x (1 - 0.04) = {stepwiseCalculations.Motor.step4.toFixed(2)} rpm </li>
              <li><span className='result'>Result : Choose a motor which have Motor Power {stepwiseCalculations.Motor.step2.toFixed(2)} kW  & Motor Speed {stepwiseCalculations.Motor.step4.toFixed(2)} rpm</span></li>
            </ul>
            </div>
            <div className='cal-container'>
            <h2>3. Design of Belt</h2>
            <ul>
              <li>Reduction Ratio = Motor Speed (N<sub>1</sub>) / Screw rpm (N<sub>2</sub>) =  {stepwiseCalculations.belt.step6.toFixed(2)}</li>
              <li>Minimum diameter recommended for B cross section pulley is 125 mm</li>
              <li>D<sub>2</sub> / D<sub>1</sub> = N<sub>1</sub> / N<sub>2</sub></li>
              <li>D<sub>2</sub> = D<sub>1</sub> x ( N<sub>1</sub> / N<sub>2</sub>), this gives - </li>
              <li>D<sub>2</sub> = Reduction Ratio x D<sub>1</sub> = {stepwiseCalculations.belt.step6.toFixed(2)} x {stepwiseCalculations.belt.step1.toFixed(2)} = {stepwiseCalculations.belt.step2.toFixed(2)} mm</li>
              <li>Diameter of the smaller pulley (D<sub>1</sub>) = 125 mm</li>
              <li>Diameter of the bigger pulley (D<sub>2</sub>) = {stepwiseCalculations.belt.step2.toFixed(2)} mm</li>
              <li>Now, Power Transmitted Capacity of a single Belt of (B) cross-section is given by</li>
              <li>Power Transmitted = [0.79 x S<sup>-0.09</sup> - 50.8/d<sub>o</sub> -1.32 x 10<sup>-4</sup> S<sup>2</sup>] x S = {stepwiseCalculations.belt.step4.toFixed(2)} kW</li>
              <li>where </li>
              <li>Belt Speed (S)= D<sub>1</sub> x W<sub>1</sub> / 2  = {stepwiseCalculations.belt.step1.toFixed(2)} x 2 x pi x 200 / 6 =  {stepwiseCalculations.belt.step3.toFixed(2)} m/s </li>
              <li>Equivalent pitch (d<sub>o</sub>) = D<sub>1</sub> x F<sub>b</sub> = {stepwiseCalculations.belt.step7.toFixed(2)}</li>
              <li>Now, Number of belt required (n) = [Motor Power x F<sub>a</sub>/ (Power Transmitted x F<sub>c</sub> x F<sub>d</sub>)] </li>
              <li> n = {Math.ceil(stepwiseCalculations.belt.step5.toFixed(2))}</li>
              <li><span className='result'>Result: </span></li>
              <li><span className='result'>Smaller Diameter = 125 mm, Power Transmitted = {stepwiseCalculations.belt.step4.toFixed(2)}, Belt Speed (S) = {stepwiseCalculations.belt.step3.toFixed(2)} m/s</span></li>
              <li><span className='result'>Bigger Diameter = 125 mm, Number of belts required (n) = {Math.ceil(stepwiseCalculations.belt.step5.toFixed(2))}</span></li>
            </ul>
            </div>
            <div className='cal-container'>
            <h2>4. Design of Pulleys</h2>
            <ul>
              <li><h3>A. Smaller Pulley Design</h3></li>
              <li>We are going to design a V grooved pulley, so we have to follow some standard dimensions, (from PSG Design Data book)</li>
              <li>Pulley Diameter (D<sub>1</sub>) = {stepwiseCalculations.pulley.step1} mm</li>
              <li>Pulley Pitch Diameter (Dp<sub>1</sub>) = {stepwiseCalculations.pulley.step8} mm</li>
              <li> Pulley Pitch Diameter (Dp<sub>2</sub>) = {stepwiseCalculations.pulley.step9} mm </li>
              <li>Length of the Key (l<sub>k</sub>) = {stepwiseCalculations.pulley.step5} mm </li>
              <li><b>1. Rim Design</b></li>
              <li>Depth of Rim (t<sub>s</sub>) = 0.35 x <span className="underroot"><span className='square-root'>√ </span> Dp<sub>1</sub> + 5</span> = 0.35 x <span className="underroot"><span className='square-root'>√ </span> {stepwiseCalculations.pulley.step8} + 5</span></li>
              <li><span className='result'>t<sub>s</sub> = {stepwiseCalculations.pulley.step3.toFixed(2)} mm </span></li>
 
              <li><b>2. Length of the Hub</b></li>
              <li>Length of the Hub (l<sub>h</sub>) = length of key (l<sub>k</sub>) </li>
              <li>l<sub>h</sub> = l<sub>k</sub> </li>
              <li><span className='result'>l<sub>h</sub> = {stepwiseCalculations.pulley.step2.toFixed(2)} mm </span></li>

              <li><b>3. Rib Design</b></li>
              <li>Thickness of Rib (t<sub>1</sub>) = original Torque / 344323 </li>
              <li>t<sub>1</sub> = {stepwiseCalculations.torque.step3.toFixed(2)} / 344323 </li>
              <li><span className='result'>t<sub>1</sub> = {stepwiseCalculations.pulley.step4} mm</span></li>

              <li><h3>B. Bigger Pulley Design</h3></li>
              <li><b>1. Rim Design</b></li>
    
              <li>Depth of Rim (t<sub>b</sub>) =  0.35 x <span className="underroot"><span className='square-root'>√ </span> Dp<sub>2</sub> + 5</span> = 0.35 x <span className="underroot"><span className='square-root'>√ </span> {stepwiseCalculations.pulley.step9} + 5</span> </li>
              <li><span className='result'>t<sub>b</sub> = {stepwiseCalculations.pulley.step7.toFixed(2)} mm</span></li>
            </ul>
           </div>
           <div className='cal-container'>
          <h2>5. Design of Chain</h2>
            <ul>
              <li>Since Velocity Ratio = 1 = N<sub>1</sub> / N<sub>2</sub></li>
              <li>From PSG Design Data Book-</li>
              <li>No. of tooth on smaller sprocket = T<sub>1</sub> = 31</li>
              <li>No. of tooth on larger sprocket = T<sub>2</sub> = T1 x N<sub>1</sub>/N<sub>2</sub> = 31 x 1 = 31</li>
              <li>K<sub>1</sub> = 1.25 Load factor for variable load with mild shock</li>
              <li>K<sub>2</sub> = 1.25, Factor for distance regulation, for fixed centre distance.</li>   
              <li>K<sub>3</sub>= 0.8, Factor for centre distance, C</li>
              <li>K<sub>4</sub>= 1.0, Factor for position of sprocket, for horizontal drive.</li>
              <li>K<sub>5</sub> = 1.5, Lubrication factor, for periodic lubrication</li>
              <li>K<sub>6</sub> = 1.0, Rating factor for 8 hr/day.</li>
              <li></li>
              <li>For chain drive,</li>
              <li>Designed Power = Rated Power x Service Factor</li>   
              <li>service factor = K<sub>s</sub> = K<sub>1</sub> x K<sub>2</sub> x K<sub>3</sub> x K<sub>4</sub> x K<sub>5</sub> x K<sub>6</sub></li>
              <li>Service Factor K<sub>s</sub> = 1.875</li>
              <li>Designed Power = 1.875 x 2.25 = 4.218 kW</li>
              <li>From PSG Design Data Book-</li>
              <li>For pinion speed of 200 rpm the power transmitted by chain 10B is 2.19kW</li>
              <li>For chain no. 10B important dimension are:</li>
              <li>Pitch (p) = 15.875 mm</li>
              <li>Roller diameter d<sub>1</sub> = 10.16 mm</li>
              <li>Width between inner plates b<sub>1</sub> = 9.65 mm</li>
              <li>Transverse pitch P<sub>t</sub>= 16.59 mm</li>
              <li>Breaking load for simplex chain = 22.2 KN</li>
              <li>Now, Pitch circle diameter of sprocket D<sub>1</sub> = p.cosec(180/T) = 157.13 mm</li>
              <li>Pitch line velocity (V) = 1.643 m/s</li>
              <li>Load on chain (W) = Rated Power / Pitch line velocity = 2.25/1.643 = 1.369 kN</li>
              <li>Factor of safety (f) = Breaking load / Load on chain = W<sub>B</sub> / W = 22200/1369 = 16.2</li>
              <li>This value is more than given in table which is 7.8</li>
              <li>The minimum centre distance between sprockets must be 30 to 50 times pitch.</li>
              <li>Centre distance between sprockets is 2.5m = 2500 mm</li>
              <li>Length of chain (L) = K<sub>p</sub> = 15.875 × 346 = 5492 mm ~ 5.5 m</li>
              <li><span className='result'>Result : Final dimension of chain are</span></li>
              <li><span className='result'>Chain No. I.S. 10B single strand</span></li>
              <li><span className='result'>Pitch p = 15.875 mm</span></li>
              <li><span className='result'>Roller dia D<sub>r</sub> = 10.16 mm</span></li>
              <li><span className='result'>Width between inner plates (b<sub>1</sub>) = 9.65 mm</span></li>
              <li><span className='result'>Breaking load Q = 22.2 KN</span></li>
              <li><span className='result'>No. of teeth on sprockets N = 31</span></li>
              <li><span className='result'>Pitch circle dia of sprocket D<sub>1</sub>= 157.13 mm</span></li>
              <li><span className='result'>Length of chain L = 346 Pitch = 5.5 m</span></li>
          </ul>
          </div>
          <div className='cal-container'>
          <h2>6. Design of Bush Bearing for Screw Spindle</h2>
            <ul>
              <p>Rotating shafts are required to be supported at suitable places. These bushes are provided to support the screw at two ends of column. The material for bush should be POROUS so as to keep lubrication even in vertical position.Inner diameter of bush should be equal to the diameter of the screw. So,</p>
              <li>Inner Diameter of Bush (D<sub>bi</sub>) = {stepwiseCalculations.diameter.result.toFixed(2)} mm</li>
              <li>Outer Diameter of Bush (D<sub>bo</sub>) = D<sub>bi</sub> + 30 = {stepwiseCalculations.diameter.result.toFixed(2) + 30} mm</li>
              <li>Length of Bush (L<sub>b</sub>) = D<sub>bi</sub> + 30 = {stepwiseCalculations.diameter.result.toFixed(2) + 30} mm</li>
              <li>Material used = POROUS Bronze</li>
            </ul>
            </div>
            <div className='cal-container'>
          <h2>7. Design of Roller</h2>
            <ul>
              <li>Bore (d) = 35 mm </li>
              <li>Outer Diameter (D) = 72 mm </li>
              <li>Width (B) = 23 mm</li>
              <li></li>
            </ul>
            <div className='img-container'><img src={rollers} alt="rollers" className='rollers'/>
            <p>Figure 2: Rollers</p></div>
            </div>
            <div className='cal-container'>
            <h2>8. Design of Telescopic Arms and Carriage</h2>
            <ul>
              <li>Width of the solid bar = b mm</li>
              <li>Depth of the solid bar = d mm</li>
              <li>Let d = 2b</li>
              <li>b = <sup>3</sup><span className="underroot"><span className='square-root'>√ </span> (16.5 x 10<sup>5</sup> x 3) /  (2 x Shear Strength)</span> </li>
              <li>b = <sup>3</sup><span className="underroot"><span className='square-root'>√ </span> (16.5 x 10<sup>5</sup> x 3) /  (2 x Shear Strength)</span> </li>
              <li>b = <sup>3</sup><span className="underroot"><span className='square-root'>√ </span>(16.5 x 10<sup>5</sup> x 3) / (2 x {ShearStrength})</span></li>
              <li>b = {stepwiseCalculations.arms.step1} mm</li>
              <li>d = {2*stepwiseCalculations.arms.step2} mm</li>
              <li>Outer Width of the hollow bar B = b + 26 </li>
              <li>B = {stepwiseCalculations.arms.step1 + 26} mm</li>
              <li>Outer Depth of the hollow bar D = d + 26 </li>
              <li>D = {stepwiseCalculations.arms.step2 + 26} mm</li>
              <li>d<sub>i</sub> = <sup>3</sup><span className="underroot"><span className='square-root'>√ </span> (2 x 5500 x 1150 x 32) /  (pi x 4 x 3 x Shear Strength)</span></li>
              <li>d<sub>i</sub> = <sup>3</sup><span className="underroot"><span className='square-root'>√ </span> (2 x 5500 x 1150 x 32) /  (pi x 4 x 3 x {ShearStrength})</span></li>
              <li>d<sub>i</sub> = {stepwiseCalculations.arms.step3} mm</li>
              <li>Outer Diamter of the eye, B<sub>1</sub> = 2d<sub>i</sub> = {stepwiseCalculations.arms.step3 * 2} mm</li>
              <li><span className='result'>Result: </span></li>
              <li><span className='result'>Width of the solid bar, b = {stepwiseCalculations.arms.step1} mm</span></li>
              <li><span className='result'>depth of the solid bar, d = {stepwiseCalculations.arms.step2} mm </span></li>
              <li><span className='result'>Outer Width of the hollow bar B = {stepwiseCalculations.arms.step1 + 26} mm </span></li>
              <li><span className='result'>Outer Depth of the hollow bar D = {stepwiseCalculations.arms.step2 + 26} mm </span></li>
              <li><span className='result'>Diameter of the pin, d<sub>i</sub> = {stepwiseCalculations.arms.step3} mm</span> </li>
              <li><span className='result'>Outer Diamter of the eye, B<sub>1</sub> = {stepwiseCalculations.arms.step3 * 2} mm</span></li>
            </ul>
            <div className='img-container'><img src={telescopicArms} alt="TelescopicArms"/>
            <p>Figure 3: Telescopic Arms</p></div>
            </div>
            <div className='cal-container'>
            <div className='img-container'>
            <h2>Machine Layout of the Lift</h2>
            <img src={machineLayout} alt="machineLayout"/>
            <p>Figure 4: Machine</p>
            </div>
          </div>
          </div>
        )} 
        <div className='about-container'>
        <p>This Expert System is made as a part of the final year project under the supervision of <span className='name'> Prof. Ahmed ALi Khan Sir</span> from Mechanical Engineering Department,
             Zakir Husain College of Engineering and Technology, AMU by following project members:  </p>
        
             <div className='about'>
    <div>
        <ul>
           
            <li><span className='name'>MUHAIYUDDIN</span></li>
            <li>20MEB20</li>
            <li>B.Tech (ME)</li>
            <li>Zakir Husain College of Engineering and Technology, AMU</li>
        </ul>
    </div>
    <div>
        <ul>
           
            <li><span className='name'>M SHAHIRIYAR SHAFI</span></li>
            <li>20MEB005</li>
            <li>B.Tech (ME)</li>
            <li>Zakir Husain College of Engineering and Technology, AMU</li>
        </ul>
    </div>
    <div>
        <ul>      
            <li><span className='name'>AZFAR ALI</span></li>
            <li>20MEB177</li>
            <li>B.Tech (ME)</li>
            <li>Zakir Husain College of Engineering and Technology, AMU</li>
        </ul>
      </div>  
      </div>
      <p id='copy-para'><img src={copyright} className='copyright'/> All rights reserved.</p>
      </div>
      </div>
    </div>
  );
}

export default App;
