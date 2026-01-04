.PHONY: all update-ip stop start clean

# Get current IP address from ifconfig
GET_IP = $(shell ifconfig | grep 'inet 192.168' | awk '{print $$2}' | head -n 1)

all: update-ip stop start

update-ip:
	@echo "Detecting IP address..."
	@IP=$$(ifconfig | grep 'inet 192.168' | awk '{print $$2}' | head -n 1); \
	if [ -z "$$IP" ]; then \
		echo "Error: No 192.168.x.x IP address found"; \
		exit 1; \
	fi; \
	echo "Found IP: $$IP"; \
	echo "Updating lib/config.js..."; \
	sed -i.bak "s|http://192\.168\.[0-9]*\.[0-9]*:8080|http://$$IP:8080|g" lib/config.js && \
	rm -f lib/config.js.bak && \
	echo "✅ Updated BASE_URL to http://$$IP:8080"

stop:
	@echo "Stopping any existing Expo servers..."
	@pkill -f "expo start" || true
	@sleep 1
	@echo "✅ Stopped existing servers"

start:
	@echo "Starting Expo development server..."
	npx expo start -p 80

clean:
	@echo "Cleaning backup files..."
	@rm -f lib/config.js.bak
	@echo "✅ Clean complete"
