FROM httpd:2.4

RUN sed -i 's/#LoadModule proxy_module/LoadModule proxy_module/' /usr/local/apache2/conf/httpd.conf \
 && sed -i 's/#LoadModule proxy_http_module/LoadModule proxy_http_module/' /usr/local/apache2/conf/httpd.conf \
 && sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf

COPY apache/spareparts.conf /usr/local/apache2/conf/extra/spareparts.conf
RUN echo "Include conf/extra/spareparts.conf" >> /usr/local/apache2/conf/httpd.conf
