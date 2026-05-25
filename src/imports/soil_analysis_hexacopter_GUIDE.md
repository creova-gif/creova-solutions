## Tools
- 3D printer with ASA/PETG capabilities
- M2.5 and M3 hex keys
- Soldering station with high-thermal capacity tip
- Heat gun for heat shrink
- Wire strippers and crimping tool
- Multimeter
- Laptop with ArduPilot/PX4 Ground Control Station
- Loctite 242 (Blue) threadlocker

## Assumptions
- Builder has experience with high-current LiPo safety
- Familiarity with UAV ground control software
- Access to a flat, level surface for IMU/Compass calibration
- Basic knowledge of Linux/Ubuntu for companion computer setup

## 1. Fabrication
### 1.1 Print companion computer and vehicle interface parts
**3D print the Jetson mounting plate and landing cradles using specified PETG and ASA settings.**
1. Load PETG filament and slice the Jetson Mount Plate with 30% infill and 3 shells.
2. Orient the Jetson Mount Plate flat on the bed to ensure M2.5 mounting holes remain dimensionally accurate.
3. Switch to ASA filament for the four Vehicle Landing Cradle components to provide UV resistance.
4. Slice the Landing Cradles using 40% infill and 4 shells for maximum structural durability during docking.
5. Remove support material and clear out the 10mm damping holes on the Jetson Mount Plate.
6. Test-fit the M2.5 screws into the companion computer mounting holes to ensure a clean pass-through.
  > Tip: Print the ASA landing cradles in a heated enclosure to prevent warping and ensure the corner guide geometry remains perfectly square for autonomous docking.

### 1.2 Install heat-set inserts or nylon standoffs into Jetson mount
*(not yet generated)*

### 1.3 Assemble folding carbon fiber arms and center plates
*(not yet generated)*

### 1.4 Dry-fit multispectral camera to gimbal bracket
*(not yet generated)*

### 1.5 Apply threadlocker to motor mounting bolts
*(not yet generated)*

## 2. Wiring
### 2.1 Solder main XT90-AS lead and ESC power wires to PDB
*(not yet generated)*

### 2.2 Route and crimp PWM signal leads from ESCs to Flight Controller
*(not yet generated)*

### 2.3 Construct high-current battery cable and verify polarity
*(not yet generated)*

### 2.4 Connect Jetson power input to 12V regulated rail
*(not yet generated)*

### 2.5 Wire CAN bus and UART telemetry links
*(not yet generated)*

### 2.6 Establish Ethernet link between Jetson and Camera
*(not yet generated)*

## 3. Bring-up
### 3.1 Flash ArduCopter firmware and configure hexacopter frame type
*(not yet generated)*

### 3.2 Calibrate ESC endpoints and verify motor rotation direction
*(not yet generated)*

### 3.3 Configure RTK GPS inject settings and verify fix status
*(not yet generated)*

### 3.4 Initialize Jetson Orin Nano and verify camera stream
*(not yet generated)*

### 3.5 Test MAVLink communication between FC and Companion Computer
*(not yet generated)*

## 4. Assembly
### 4.1 Secure Flight Controller and PDB within center frame
*(not yet generated)*

### 4.2 Mount motors and props ensuring correct CW/CCW orientation
*(not yet generated)*

### 4.3 Install gimbal and multispectral camera assembly
*(not yet generated)*

### 4.4 Attach GPS mast and RTK module for maximum sky view
*(not yet generated)*

### 4.5 Mount vehicle landing cradle to vehicle roof rack
*(not yet generated)*

### 4.6 Perform final balance check and secure battery strap
*(not yet generated)*
