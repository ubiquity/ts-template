non_compliant_files=()
ignoreList=("^\.\/.git" "^\.\/\..*" "^\.\/[^\/]*$")
ignoreList+=("^\.\/node_modules")
while IFS= read -r line; do
ignoreList+=(".*$line")
done < .gitignore
while read -r file; do
basefile=$(basename "$file")
ignoreFile=false
for pattern in "${ignoreList[@]}"; do
    if [[ "$file" =~ $pattern ]]; then
    ignoreFile=true
    break
    fi
done
if $ignoreFile; then
    continue
elif ! echo "$basefile" | grep -q -E "^([a-z0-9]+-)*[a-z0-9]+(\.[a-zA-Z0-9]+)?$"; then
    non_compliant_files+=("$file")
    echo "::warning file=$file::This file is not in kebab-case"
fi
done < <(find . -type f -name '*.ts' -print | grep -E '/[a-zA-Z0-9_-]+\.ts$')
if [ ${#non_compliant_files[@]} -ne 0 ]; then
echo "The following files are not in kebab-case:"
for file in "${non_compliant_files[@]}"; do
    echo "  - $file"
done
exit 1
fi