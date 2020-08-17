sync::
	ln -f ../../bhffer/public_html/app/*.html .
	# don't copy README.md and Makefile
	ln -f ../../bhffer/public_html/app/*.py .
	ln -f ../../bhffer/public_html/app/js/*.js ./js/
	ln -f ../../bhffer/public_html/app/css/*.css ./css/
	ln -f ../../bhffer/public_html/app/css/*.map ./css/
	ln -f ../../bhffer/public_html/app/fonts/* ./fonts/
	ln -f ../../bhffer/public_html/app/img/* ./img/
	ln -f ../../bhffer/public_html/app/sm2/*.html ./sm2/
	ln -f ../../bhffer/public_html/app/sm2/README.md ./sm2/
	ln -f ../../bhffer/public_html/app/sm2/js/*.js ./sm2/js/
	ln -f ../../bhffer/public_html/app/sm2/js/*.py ./sm2/js/
	ln -f ../../bhffer/public_html/app/sm2/js/Makefile ./sm2/js/
	ln -f ../../bhffer/public_html/app/sm2/css/*.css ./sm2/css/
	rsync -avz ../../bhffer/public_html/app/sm2/image ./sm2/
	rsync -avz ../../bhffer/public_html/app/sm2/Sound ./sm2/
	$(MAKE) merger -C sm2/js
	$(MAKE) clean
	git add *.html *.py js/* css/* img/* fonts/* sm2

push_ready:
	$(MAKE) sync
	python jsdelivr_purge.py


clean::
	find . -name "*~" | xargs rm -f

