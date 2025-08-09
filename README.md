# Form Builder

A modern, feature-rich React TypeScript application for building dynamic forms with validation, derived fields, and a beautiful dark theme.

## Features

- 🎨 **Modern UI**: Beautiful dark theme with gradients and animations
- 📝 **Form Builder**: Create dynamic forms with various field types
- 🔧 **Field Configuration**: Configure validation rules, default values, and derived fields
- 👀 **Form Preview**: Real-time preview with validation
- 💾 **Form Management**: Save, load, edit, and delete forms
- 🧮 **Derived Fields**: Auto-calculated fields based on other form values
- ✅ **Validation System**: Comprehensive validation rules
- 📱 **Responsive Design**: Works on all device sizes

## Field Types

- Text
- Number
- Textarea
- Select (dropdown)
- Radio buttons
- Checkbox
- Date picker

## Validation Rules

- Required fields
- Minimum/Maximum length
- Email format
- Password rules
- Custom validation messages

## Tech Stack

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Vite** as the build tool
- **Day.js** for date handling

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Form-Builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
npm run build
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

The `vercel.json` file is already configured to handle client-side routing.

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

The `public/_redirects` file handles client-side routing.

### Other Platforms

For other hosting platforms, ensure they support client-side routing or configure them to serve `index.html` for all routes.

## Project Structure

```
Form-Builder/
├── src/
│   ├── components/
│   │   ├── FormBuilder/          # Form creation interface
│   │   ├── FormPreview/          # Form preview and testing
│   │   ├── MyForms/             # Form management
│   │   └── Navigation/          # App navigation
│   ├── store/                   # Redux store and slices
│   ├── types/                   # TypeScript interfaces
│   ├── utils/                   # Validation utilities
│   └── App.tsx                  # Main application component
├── public/                      # Static assets
├── vercel.json                  # Vercel configuration
└── package.json                 # Dependencies and scripts
```

## Key Features Explained

### Form Builder
- Drag and drop field types
- Real-time field configuration
- Validation rule setup
- Derived field logic

### Form Preview
- Live form testing
- Validation feedback
- Derived field calculations
- Form submission simulation

### Form Management
- Save forms with custom names
- Load and edit existing forms
- Delete forms with confirmation
- Form metadata display

### Derived Fields
- Auto-calculated based on other fields
- Support for age calculations
- Sum and concatenation operations
- Real-time updates

## Troubleshooting

### 404 Error on Page Reload

This issue has been fixed with the following configurations:

1. **Vercel**: `vercel.json` handles routing
2. **Netlify**: `public/_redirects` handles routing
3. **Development**: Vite configuration includes `historyApiFallback`

### Build Issues

- Ensure Node.js version is 16+
- Clear `node_modules` and reinstall if needed
- Check TypeScript configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
