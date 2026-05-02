# Devsync Template Creation System

## Overview

The goal is to create a new command `devsync create template` that allows users to create their own templates for the devsync system. This will enable users to build custom templates that can be used with `devsync update` to generate professional artifacts from their DEVSYNC.json data.

## Current System Analysis

### What devsync update needs to work:

1. **DEVSYNC.json** - The core data file containing all profile information
2. **CV Component** - An Astro component that generates the CV HTML (src/pages/[lang]/cv.astro)
3. **GitHub Action** - The workflow file that triggers updates on DEVSYNC.json changes
4. **Required dependencies in package.json** - The template needs to have the required dependencies for devsync to work

### Current template structure:

- DEVSYNC.json (data source)
- src/pages/[lang]/cv.astro (CV component that generates HTML for the PDF)
- .github/workflows/update-on-devsync-change.yml (GitHub action for automatic updates)
- package.json with required dependencies

## Technical Approach

### 1. Command Structure

Create a new command `devsync create template`

- Copies the minimal required files for `devsync update` to work
- Preserves the framework-agnostic nature of the system
- Allows users to create templates in any framework (Astro, React, Vue, etc.)

### 2. Required Files for devsync update

The system needs these files to function:

- DEVSYNC.json
- A CV component that can generate the required HTML for the PDF generation
- GitHub workflow for automatic updates
- Dependencies in package.json

### 3. Implementation Plan

#### A. Core Functionality

1. Create a new command `devsync create template`
2. Command should copy the essential files needed for devsync update to work:
   - DEVSYNC.json (template version)
   - GitHub workflow
   - Required dependencies

#### B. File Structure

The new command should create a template with:

```
template/
├── DEVSYNC.json (template)
├── .github/workflows/update-on-devsync-change.yml
└── package.json
```

#### C. Template System Design

1. Users can create templates in any framework (Astro, React, Vue, etc.)
2. The CV component must be able to generate HTML that can be consumed by devsync
3. The template should include the GitHub workflow for automatic updates
4. The DEVSYNC.json should be a template that users can fill in

### 4. Implementation Steps

#### A. Create Template Module

1. Create `apps/cli/modules/create-template/` directory
2. Add command to `commands.ts`:
   ```typescript
   {
     name: 'create-template',
     command: 'devsync create template',
     description: 'Create a new template for devsync',
   }
   ```

#### B. Required Functionality

1. Copy template files needed for devsync update to work
2. Include:
   - DEVSYNC.json template
   - CV component template
   - GitHub workflow
   - package.json with required dependencies

#### C. Template Structure

The template should include:

1. A DEVSYNC.json file with sample data
2. A CV component that generates the required HTML structure that devsync can consume
3. The GitHub workflow for automatic updates
4. A package.json with required dependencies
