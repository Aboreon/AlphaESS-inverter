# AlphaESS

This app allows you to integrate Alpha-ESS data into Homey. You can choose between two connection methods: the Alpha-ESS Open API or a local Modbus connection. This flexibility ensures you can utilize the app according to your preferences and technical setup.

## Features

- **API Integration:** The app connects to Alpha-ESS via their open API. Learn more: [Alpha-ESS Open API](https://open.alphaess.com/).
- **Local Modbus Connection (New):** Connect to your Alpha-ESS system locally via Modbus for extended functionality. In this setup, you only need to add the IP address or hostname in the app's settings.

## Setup Instructions

### Using the Alpha-ESS Open API
1. Create an account at [Alpha-ESS Open API](https://open.alphaess.com/).
2. Add your system to the account:
   - Click "Add."
   - Enter the Serial Number and CheckCode (found on your inverter).
   - Click "Get Verification Code" and input the code sent to your email.
   - Note down the **AppId** and **AppSecret**.
3. Install the Alpha-ESS app from Homey: [Alpha-ESS App](https://homey.app/nl-nl/app/nl.aboreaon.alpaess/AlphaESS/).
4. Open the app in Homey and configure it:
   - Input your **AppId** and **AppSecret**.
5. Add the device to your setup.

### Using the Local Modbus Connection
1. Ensure your Alpha-ESS inverter supports Modbus communication.
2. Locate the local IP address or hostname of your inverter.
3. Install the Alpha-ESS app from Homey: [Alpha-ESS App](https://homey.app/nl-nl/app/nl.aboreaon.alpaess/AlphaESS/).
4. Open the app in Homey and configure it:
   - Input your **Hostname** and **Port**.
5. Add the device to your setup.

