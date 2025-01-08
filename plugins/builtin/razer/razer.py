#!/bin/python



import subprocess

name = "Unknown/Error"
battery = 0
charging = False
dpiLevel = 0
brightness = 0
try:
    res = str(subprocess.check_output(["razer-cli", "-ls"]))
    parts = res.split("\\n")
    name = parts[1].replace(":", "")
    battery = 0
    dpiLevel = parts[3].split(":")[1].replace("(", "").replace(")", "").strip().split(", ")[0]
    for i,part in enumerate(parts):
        part = part.strip()
        # print(part)
        if "battery" in part:
            battery = parts[i+1].split(":")[1].strip()
        if "charging: True" in part:
            charging = True
        if "logo zone" in part:
            brightness = parts[i+1].split(":")[1].strip()
        
    name = name.replace(" (Wireless)", "").replace(" (Wired)", "")
    
except Exception as e:
    pass
print(name)
print(battery)
print(charging)
print(dpiLevel)
print(brightness)

