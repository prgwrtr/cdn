Github username: prgwrtr

## Common use
```
make sync
git tag -a "v0.0.3" -m "version v0.0.3"
git push --follow-tags
```

## jsDelivr

files in github are automatically mapped to jsDelivr

content delivery files jsdelivr

Example
```
https://cdn.jsdelivr.net/gh/prgwrtr/cdn@0.0.1/sm2/js/mbuembed.js
```


For more documentation, see
https://www.jsdelivr.com/?docs=gh

// load any GitHub release, commit, or branch

// note: we recommend using npm for projects that support it

https://cdn.jsdelivr.net/gh/user/repo@version/file

// load jQuery v3.2.1

https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/dist/jquery.min.js

// use a version range instead of a specific version

https://cdn.jsdelivr.net/gh/jquery/jquery@3.2/dist/jquery.min.js

https://cdn.jsdelivr.net/gh/jquery/jquery@3/dist/jquery.min.js

// omit the version completely to get the latest one

// you should NOT use this in production

https://cdn.jsdelivr.net/gh/jquery/jquery/dist/jquery.min.js

// add ".min" to any JS/CSS file to get a minified version

// if one doesn't exist, we'll generate it for you

https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/src/core.min.js

// add / at the end to get a directory listing

https://cdn.jsdelivr.net/gh/jquery/jquery/


## Version

### Add tag in git

https://stackoverflow.com/questions/37814286/how-to-manage-the-version-number-in-git

```
git tag -a "v1.5.0-beta" -m "version v1.5.0-beta"
```

### Push tag to github

https://stackoverflow.com/questions/5195859/how-do-you-push-a-tag-to-a-remote-repository-using-git

push a single tag
```
git push origin <tag_name>
```

push all tags
```
git push --tags
```

```
git push --follow-tags
```

```
git config --global push.followTags true
```
