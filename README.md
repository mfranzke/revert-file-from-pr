# Revert File Action

Reverts a file in a PR back to the base branch version when a comment like:

```
/revert-file path/to/file.txt
```

...is added to the PR.

## Usage

```yaml
- uses: mfranzke/revert-file-from-pr@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```