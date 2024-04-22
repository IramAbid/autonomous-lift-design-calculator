from tkinter import Tk, Label, Entry, Button

def calculate_diameter():
  """
  Calculates the screw diameter based on user input.
  """
  try:
    # Get user input from entry fields
    original_torque = float(original_torque_entry.get())
    weight = float(weight_entry.get())
    eccentricity = float(eccentricity_entry.get())
    torque_required = float(torque_required_entry.get())
    max_shear_stress = float(max_shear_stress_entry.get())

    # Import libraries for calculations (within function for encapsulation)
    from math import sqrt, pi

    # Equivalent torque calculation
    tau_eq = sqrt((0.25 * weight * eccentricity) * 2 + (2 * original_torque) * 2)

    # Diameter calculation
    diameter = (16 * torque_required / (pi * max_shear_stress)) ** (1/3)

    # Display result
    result_label.config(text=f"Calculated Diameter: {diameter:.4f} m")
  except ValueError:
    result_label.config(text="Invalid Input! Please enter numbers only.")

# Create the main window
window = Tk()
window.title("Screw Design Calculator")

# Labels for user input
original_torque_label = Label(window, text="Original Torque (N-mm):")
original_torque_label.grid(row=0, column=0, pady=5)

weight_label = Label(window, text="Weight Being Lifted (N):")
weight_label.grid(row=1, column=0, pady=5)

eccentricity_label = Label(window, text="Eccentricity (mm):")
eccentricity_label.grid(row=2, column=0, pady=5)

torque_required_label = Label(window, text="Torque Required (Nm):")
torque_required_label.grid(row=3, column=0, pady=5)

max_shear_stress_label = Label(window, text="Maximum Shear Stress (Pa):")
max_shear_stress_label.grid(row=4, column=0, pady=5)

# Entry fields for user input
original_torque_entry = Entry(window)
original_torque_entry.grid(row=0, column=1, padx=5)

weight_entry = Entry(window)
weight_entry.grid(row=1, column=1, padx=5)

eccentricity_entry = Entry(window)
eccentricity_entry.grid(row=2, column=1, padx=5)

torque_required_entry = Entry(window)
torque_required_entry.grid(row=3, column=1, padx=5)

max_shear_stress_entry = Entry(window)
max_shear_stress_entry.grid(row=4, column=1, padx=5)

# Button to trigger calculation
calculate_button = Button(window, text="Calculate Diameter", command=calculate_diameter)
calculate_button.grid(row=5, columnspan=2, pady=10)

# Label for displaying result
result_label = Label(window, text="")
result_label.grid(row=6, columnspan=2)

window.mainloop()