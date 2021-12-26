sync::
	ln -f ../../bhffer/public_html/app/*.html .
	# don't copy README.md and Makefile
	ln -f ../../bhffer/public_html/app/*.py .
	ln -f ../../bhffer/public_html/app/js/*.js ./js/
	ln -f ../../bhffer/public_html/app/css/*.css ./css/
	ln -f ../../bhffer/public_html/app/css/*.map ./css/
	ln -f ../../bhffer/public_html/app/fonts/* ./fonts/
	rsync -avz ../../bhffer/public_html/app/img ./
	$(MAKE) -C sm2
	$(MAKE) -C splayer
	$(MAKE) clean
	git add *.html *.py js/* css/* img/* fonts/* sm2
	echo "After git push a new version, remember to run jsdelivr_purge.py as instructed in ../README.md"

# run this after git push
purge::
	python jsdelivr_purge.py

clean::
	find . -name "*~" | xargs rm -f

