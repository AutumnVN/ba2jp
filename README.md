# ba2jp

Dump Blue Archive account data and convert to [justin163.com/planner](https://justin163.com/planner) import

\*insert [tos](https://www.nexon.com/main/en/legal/tou) violation  disclaimer\*

## Usage

Install [mitmproxy](https://mitmproxy.org/) and [Node.js](https://nodejs.org/) on your desktop

Install [WireGuard client](https://www.wireguard.com/install/) on your phone

Make sure your phone and desktop are on the same network

Run `1.wireguard.bat` or

```
mitmweb -m wireguard
```

Click `Capture` tab to see WireGuard QR code

On phone open WireGuard, tap `+` > `Scan from QR code` and scan the QR code

Close mitmweb

Run `2.dump.bat` or

```
mitmdump -q -m wireguard -s dump.py
```

On phone turn on the WireGuard tunnel and open Blue Archive

After `Tap to Login` a few seconds, you will get `Account_LoginSync.json` and `Item_List.json` then you can close

Optionally you can input your existing planner data in `input.json` to merge

Run `3.convert.bat` or

```
node .
```

Copy `output.json` content and import in [justin163.com/planner](https://justin163.com/planner)
