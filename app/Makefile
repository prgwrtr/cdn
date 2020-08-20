sync::
	ln -f ../../bhffer/public_html/app/*.html .
	# don't copy README.md and Makefile
	ln -f ../../bhffer/public_html/app/*.py .
	ln -f ../../bhffer/public_html/app/js/*.js ./js/
	ln -f ../../bhffer/public_html/app/css/*.css ./css/
	ln -f ../../bhffer/public_html/app/css/*.map ./css/
	ln -f ../../bhffer/public_html/app/fonts/* ./fonts/
	rsync -avz ../../bhffer/public_html/app/img ./
	ln -f ../../bhffer/public_html/app/sm2/*.html ./sm2/
	ln -f ../../bhffer/public_html/app/sm2/README.md ./sm2/
	ln -f ../../bhffer/public_html/app/sm2/js/*.js ./sm2/js/
	ln -f ../../bhffer/public_html/app/sm2/js/*.py ./sm2/js/
	ln -f ../../bhffer/public_html/app/sm2/js/Makefile ./sm2/js/
	ln -f ../../bhffer/public_html/app/sm2/css/*.css ./sm2/css/
	ln -f ../../bhffer/public_html/app/sm2/swf/*.swf ./sm2/swf/
	rsync -avz ../../bhffer/public_html/app/sm2/image ./sm2/
	rsync -avz ../../bhffer/public_html/app/sm2/Sound ./sm2/
	$(MAKE) merger -C sm2/js
	$(MAKE) clean
	git add *.html *.py js/* css/* img/* fonts/* sm2
	echo "After git push a new version, remember to run jsdelivr_purge.py as instructed in ../README.md"

# run this after git push
purge::
	python jsdelivr_purge.py


clean::
	find . -name "*~" | xargs rm -f

