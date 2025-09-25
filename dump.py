import json

def tls_clienthello(data):
    if not data.context.server.address[1] == 5000:
        data.ignore_connection = True
        return

def response(flow):
    if not flow.request.pretty_host.endswith("bagl.nexon.com"):
        return
    if not flow.request.path == "/api/gateway":
        return

    response_data = json.loads(flow.response.content)
    if "protocol" not in response_data or "packet" not in response_data:
        return

    protocol = response_data["protocol"]

    if "Account_LoginSync" not in protocol and "Item_List" not in protocol:
        return

    filename = protocol + ".json"
    with open(filename, "w") as f:
        json.dump(json.loads(response_data["packet"]), f, indent=4)

    print(f"Wrote: {filename}")

print("Ready!")
