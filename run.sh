branch=$(git rev-parse --abbrev-ref HEAD)
[[ $branch = "main" ]] && echo "yes main" || echo "no main"