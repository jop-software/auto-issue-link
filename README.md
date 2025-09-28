<div align="center">
    <h1>Auto issue link Github Action</h1>
    <p>Link new Pull Requests with existing Issues by the branch name.</p>
</div>

## What is does?

This action allows you to automatically link new Pull Requests with existing Issues based on the branch name. If a branch name contains an issue number (e.g., `feature/1234-new-feature`), the action will link the corresponding issue (e.g., issue #1234) to the newly created Pull Request.

## Inputs

| Name    | Description                                 | Default               |
| ------- | ------------------------------------------- | --------------------- |
| `token` | Token for authorized use of the Github API. | `${{ github.token }}` |

## Example usage

```yaml
name: Auto Issue Link
on:
  pull_request:
    types: [opened]

jobs:
  link-pr-to-issue:
    runs-on: ubuntu-latest
    steps:
      - uses: "jop-software/auto-issue-link@v1"
```

## License

This project is licensed under the terms of the AGPL-3.0 license. See the [LICENSE](LICENSE) file for details.

### Enterprise Support and Licensing

Enterprise Support and Licensing is available, contact [info@jop-software.de](mailto:info@jop-software.de) for more information.

<div align="center">
    <span>&copy; 2025, jop-software Inh. Johannes Przymusinski</span>
</div>
