NPM := "npm"

help:
	just --list

# Install project dependencies
install:
	{{NPM}} install

# Start the application
start:
	{{NPM}} start

# Test the application
test:
	{{NPM}} test

# Update NPM Packages
update-mathjs:
	{{NPM}} install mathjs@latest
	{{NPM}} update packages

# Update NPM Packages
update:
	{{NPM}} update packages

# Display Git History
history:
	gitk --all

# Display NPM Depency Tree
dependency:
	{{NPM}} ls -all
