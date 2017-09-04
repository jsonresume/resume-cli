FROM node:8-alpine
RUN mkdir /data && \
	apk --no-cache add git && \
	npm install phantomjs-prebuilt@2.1.13 && \
	npm install -g resume-cli
RUN npm install -g jsonresume-theme-elegant && \
	npm install -g jsonresume-theme-slick && \
	npm install -g jsonresume-theme-kendall

WORKDIR /data
CMD bash