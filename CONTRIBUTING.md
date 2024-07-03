# Contributing to Angular NgRx Products

We welcome contributions to the Angular NgRx Products project! Here are some guidelines to help you get started:

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How to Contribute](#how-to-contribute)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Commit Messages](#commit-messages)
6. [Submitting a Pull Request](#submitting-a-pull-request)
7. [Issues](#issues)

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.

## How to Contribute

1. Fork the repository.
2. Clone your fork:
    ```sh
    git clone https://github.com/yarob-alrifai/angular-chat-realtime
    ```
3. Create a branch for your feature or fix:
    ```sh
    git checkout -b feature-branch
    ```
4. Make your changes.
5. Push your branch to your forked repository:
    ```sh
    git push origin feature-branch
    ```
6. Open a pull request to the main repository.

## Development Setup

1. Install dependencies:
    ```sh
    npm install
    ```
2. Generate dummy data using Faker.js:
    ```sh
    npm run generate
    ```
3. Start the JSON server and Angular application concurrently:
    ```sh
    npm run dev
    ```

## Coding Standards

- Follow the existing code style.
- Use Tailwind CSS for styling.
- Use Angular Material components where applicable.
- Write clear, concise, and meaningful commit messages.
- Write tests for new features and bug fixes.
- Ensure all tests pass before submitting a pull request.

## Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally.

## Submitting a Pull Request

1. Ensure your code follows the project’s style guidelines.
2. Write tests for the code you wrote.
3. Ensure all tests pass.
4. Add a descriptive title and summary for your pull request.
5. If the pull request addresses an issue, please include a reference to the issue in the pull request description (e.g., `Closes #123`).

## Issues

We use GitHub issues to track bugs and feature requests. Before opening a new issue, please search for existing issues to see if your issue has already been reported.

When you open an issue, please include:

- A clear, descriptive title.
- A detailed description of the problem or suggestion.
- Steps to reproduce the issue (if applicable).
- Any relevant logs or screenshots.

Thank you for contributing!
