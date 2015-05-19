The server is on port 3000 to make it running without using root.

Need to run the following command to redirect 80 to 3000:
iptables -t nat -A PREROUTING -i venet0 -p tcp --dport 80 -j REDIRECT --to-port 3000
