sync::
	ln -f ../bhffer/public_html/app/*.html ./
	ln -f ../bhffer/public_html/app/js/*.js ./js/
	ln -f ../bhffer/public_html/app/css/*.css ./css/
	ln -f ../bhffer/public_html/app/css/*.map ./css/
	ln -f ../bhffer/public_html/app/fonts/* ./fonts/
	ln -f ../bhffer/public_html/app/sm2/js/*.js ./sm2/js/
	ln -f ../bhffer/public_html/app/sm2/css/*.css ./sm2/css/
	rsync -avz ../bhffer/public_html/app/sm2/image ./sm2/
	rsync -avz ../bhffer/public_html/app/sm2/Sound ./sm2/
	$(MAKE) clean

clean::
	find . -name "*~" | xargs rm -f

