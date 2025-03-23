# Dockerfile

# Use Nginx as the base image
FROM nginx:alpine

# Remove the default Nginx config file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Phaser game files into the nginx HTML directory
COPY dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
