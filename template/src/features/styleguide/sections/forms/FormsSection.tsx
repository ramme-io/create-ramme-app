// src/pages/styleguide/sections/forms/FormsSection.tsx
import React, { useState } from 'react';
import {
  Card,
  Button,
  ButtonGroup,
  Input,
  SearchInput,
  Select,
  Checkbox,
  Radio,
  ToggleSwitch,
  ComboBox,
  MultiSelect,
  DatePicker,
  FileUpload,
  FormTemplate,
  useToast,
  SectionHeader,
  Icon,
  type FormField,
  type MultiSelectOption,
} from '@ramme-io/ui';


const FormsSection: React.FC = () => {
  const { addToast } = useToast();

  // State for various form controls
  const [selectedOption, setSelectedOption] = useState('option1');
  const [isChecked, setIsChecked] = useState(false);
  const [isToggled, setIsToggled] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState('optionA');
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFruit, setSelectedFruit] = useState<string | number | null>('apple');
  const [selectedCountries, setSelectedCountries] = useState<MultiSelectOption[] | null>([
    { value: 'usa', label: 'United States' },
    { value: 'can', label: 'Canada' }
  ]);

  const isError = inputValue.length > 0 && inputValue.length < 5;

  const selectOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ];

  const countryOptions: MultiSelectOption[] = [
    { value: 'usa', label: 'United States' },
    { value: 'can', label: 'Canada' },
    { value: 'mex', label: 'Mexico' },
  ];

  const handleFileUpload = (files: File[]) => {
    addToast(`Files uploaded: ${files.map(f => f.name).join(', ')}`, 'success');
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    addToast('Form submitted successfully!', 'success');
    console.log('Form Submitted:', formData);
  };

  const userProfileFields: FormField[] = [
    { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'John Doe', colSpan: 2 },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john.doe@example.com', colSpan: 2 },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      options: countryOptions,
      value: 'can',
    },
    { name: 'subscribeNewsletter', label: 'Subscribe to Newsletter', type: 'checkbox', checked: true },
  ];


  return (
    <div className="space-y-8">
      <SectionHeader title="Form Components & Patterns" />
       <p className="text-muted-foreground -mt-6">
        A collection of components for building forms, from basic inputs and buttons to advanced file uploads and declarative form templates.
      </p>

      <Card id="form-buttons" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Buttons & Button Groups</h3>
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="primary" loading={isLoading} onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 2000); }}>
                {isLoading ? 'Loading...' : 'Click to Load'}
              </Button>
              <Button variant="primary" iconBefore={<Icon name="plus" />}>Create</Button>
            </div>
            <div>
            <ButtonGroup>
              <Button variant="outline">Copy</Button>
              <Button variant="outline">Paste</Button>
            </ButtonGroup>
          </div>
        </div>
      </Card>

      <Card id="form-inputs" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Standard & Search Inputs</h3>
        <div className="space-y-6 max-w-md">
          <Input label="Standard Input" type="text" placeholder="Placeholder text..." />
          <Input
            label="Validation Example"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            error={isError}
            helperText={isError ? "Input must be at least 5 characters long." : "This is a hint."}
          />
          <SearchInput placeholder="Search for anything..." />
        </div>
      </Card>

      <Card id="form-select" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Selection Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Select label="Choose an option" options={selectOptions} value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} />
            <Checkbox label="Remember me" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
            <ToggleSwitch label="Enable Notifications" checked={isToggled} onChange={setIsToggled} />
          </div>
          <div className="space-y-4">
              <p className="font-medium text-text">Radio Group</p>
              <Radio name="radioGroup1" label="Option A" value="optionA" checked={selectedRadio === 'optionA'} onChange={(e) => setSelectedRadio(e.target.value)} />
              <Radio name="radioGroup1" label="Option B" value="optionB" checked={selectedRadio === 'optionB'} onChange={(e) => setSelectedRadio(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card id="form-advanced" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Advanced Inputs</h3>
        <div className="space-y-6 max-w-md">
          <ComboBox
            label="Combo Box (Autocomplete)"
            options={fruitOptions}
            value={selectedFruit}
            onOptionSelect={(value) => setSelectedFruit(value)}
            placeholder="Search for a fruit..."
          />
          <MultiSelect
            label="Multi-Select"
            options={countryOptions}
            value={selectedCountries}
            onChange={setSelectedCountries}
          />
          <DatePicker
            label="Date Picker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholderText="Click to select a date"
          />
        </div>
      </Card>

      <Card id="form-upload" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">File Upload</h3>
        <div className="max-w-md">
            <FileUpload
                label="Upload your document"
                onFileUpload={handleFileUpload}
            />
        </div>
      </Card>
      
      <Card id="form-template" className="p-6 scroll-mt-20">
        <SectionHeader title="User Registration Template" className="mb-6" />
        <FormTemplate
          fields={userProfileFields}
          onSubmit={handleFormSubmit}
        >
          <div className="flex justify-end">
            <Button type="submit" variant="primary">Register</Button>
          </div>
        </FormTemplate>
      </Card>
    </div>
  );
};

export default FormsSection;