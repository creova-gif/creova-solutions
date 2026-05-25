## Tools
- 3D printer with PETG capability
- Metric hex key set (M2.5, M3, M5)
- Digital Multimeter
- Soldering iron and lead-free solder
- Wire strippers and crimping tool (for XT60 and terminals)
- Velcro cable ties
- Heat gun for shrink tubing

## Assumptions
- Builder has access to PETG filament and 3D printing software
- Basic knowledge of Linux/Raspberry Pi terminal
- Familiarity with high-current LiFePO4 battery safety
- Ability to configure 5G modem settings

## 1. Fabrication
### 1.1 Print weatherproof main housing and lids
*(not yet generated)*

### 1.2 Print high-precision thermal camera gimbal mount
*(not yet generated)*

### 1.3 Print reinforced motor mounting brackets
*(not yet generated)*

### 1.4 Cut and deburr aluminum V-slot rails to length
*(not yet generated)*

### 1.5 Test-fit M3 nylon standoffs into enclosure floor
*(not yet generated)*

## 2. Wiring
### 2.1 Solder high-current XT60 leads to motor driver power input
*(not yet generated)*

### 2.2 Connect motors to driver terminals with 16AWG wire
*(not yet generated)*

### 2.3 Wire battery output to 5V buck converter input
*(not yet generated)*

### 2.4 Solder 5V regulated output to Raspberry Pi power pins
*(not yet generated)*

### 2.5 Establish UART serial link between MCU and motor driver
*(not yet generated)*

### 2.6 Apply heat shrink to all exposed power junctions
*(not yet generated)*

## 3. Bring-up
### 3.1 Verify 5V rail stability before connecting MCU
*(not yet generated)*

### 3.2 Initialize 5G modem and verify cellular data link
*(not yet generated)*

### 3.3 Capture and stream VGA frames from Boson camera
*(not yet generated)*

### 3.4 Calibrate motor driver throttle range and direction
*(not yet generated)*

### 3.5 Test failsafe logic for battery low-voltage cutoff
*(not yet generated)*

## 4. Assembly
### 4.1 Assemble 2020 frame using corner brackets and M5 hardware
*(not yet generated)*

### 4.2 Mount drive motors and wheels to chassis rails
*(not yet generated)*

### 4.3 Secure swivel caster to rear chassis center
*(not yet generated)*

### 4.4 Install RPi, Modem, and Driver into printed enclosure
**Mount the Raspberry Pi, 5G modem, and motor driver using M3 nylon standoffs.**
1. Screw eight M3x10mm nylon standoffs into the internal mounting bosses of the PETG Weatherproof Housing.
2. Seat the Main Controller and Dual Motor Controller onto their respective standoff sets.
3. Secure the boards using M3 nylon screws, ensuring the motor driver's terminal blocks align with wire exit ports.
4. Connect the 5G Communications Module to the Raspberry Pi and secure it to the internal chassis.
5. Plug the UART jumper wire from Raspberry Pi GPIO18 to the motor driver S1 signal pin.
  > Tip: Leave slack in the internal cables to prevent vibration-induced disconnects during high-speed off-road inspections.

### 4.5 Fix thermal camera mount to front of enclosure
*(not yet generated)*

### 4.6 Secure battery pack to frame center using Velcro straps
*(not yet generated)*

### 4.7 Perform final enclosure seal and IP65 verification
*(not yet generated)*
