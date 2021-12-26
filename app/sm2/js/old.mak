minjs = mbuembed.min.js bar-ui.min.js

minify: $(minjs)

$(minjs) : %.min.js : %.js Makefile
	uglifyjs $< -o $@ -m -c

sm2_js::
	ln -f ../../../../bhffer/public_html/app/sm2/js/*.js .
	ln -f ../../../../bhffer/public_html/app/sm2/js/*.py .
	ln -f ../../../../bhffer/public_html/app/sm2/js/Makefile .
	$(MAKE) merger

merger::
	python merger.py
