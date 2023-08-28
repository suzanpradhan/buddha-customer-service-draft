import { SelectorDataType } from '@/core/types/selectorTypes';
import React from 'react';
import Select, { MultiValue, SingleValue, components } from 'react-select';
import AsyncSelect from 'react-select/async';
import Creatable from 'react-select/creatable';

export interface SelectorProps {
  label?: string;
  placeholder?: string;
  id: string;
  name?: string;
  isMulti?: boolean;
  required?: boolean;
  className?: string;
  options: SelectorDataType[];
  defaultValue?: SelectorDataType;
  isClearable?: boolean;
  isCompact?: boolean;
  suffix?: React.ReactNode;
  value?: SingleValue<SelectorDataType> | MultiValue<SelectorDataType>;
  type?: 'Creatable' | 'Select' | 'Async';
  loadOptions?: (inputValue: string) => void;
  onChange?: any;
  formatOptionLabel?: (data: SelectorDataType) => React.ReactNode;
}

class SelectorV2 extends React.Component {
  constructor(props: SelectorProps) {
    super(props);
    // console.log(this.props.defaultValue);

    // if (props.defaultValue) {
    //   this.props.onChange(this.props.name, this.props.defaultValue?.value);
    //
  }
  props: SelectorProps = this.props;

  handleChange = (
    value: SingleValue<SelectorDataType> | MultiValue<SelectorDataType>
  ) => {
    if (Array.isArray(value)) {
      this.props.onChange(
        this.props.name,
        value.map((selectorData: SelectorDataType) =>
          selectorData.__isNew__ ? selectorData : selectorData
        )
      );
    } else {
      if (!value) {
        this.props.onChange(this.props.name, null);
      } else {
        this.props.onChange(
          this.props.name,
          (value as SelectorDataType).__isNew__
            ? value
            : (value as SelectorDataType).value
        );
      }
    }
  };

  render() {
    return (
      <div
        className={`flex flex-col last-of-type:mb-0 ` + this.props.className}
      >
        {this.props.label ? (
          <label htmlFor={this.props.id} className="text-sm mb-2 text-dark-500">
            {this.props.label}
          </label>
        ) : (
          <></>
        )}
        {this.props.type == 'Creatable' ? (
          <Creatable
            id={this.props.id}
            isClearable={true}
            required={this.props.required}
            options={this.props.options}
            isMulti={this.props.isMulti}
            name={this.props.name}
            placeholder={this.props.placeholder}
            value={this.props.value}
            formatOptionLabel={this.props.formatOptionLabel}
            onChange={this.handleChange}
            defaultValue={this.props.defaultValue}
            components={{
              Control: ({ children, ...props }) => {
                return (
                  <components.Control {...props}>
                    {children}
                    {this.props.suffix ?? <></>}
                  </components.Control>
                );
              },
            }}
            styles={{
              control: (base) => ({
                ...base,
                // minHeight: this.props.isCompact ? 34 : 44,
                // maxHeight: this.props.isCompact ? 34 : 44,
                border: 'none',
                outline: 'none',
                borderRadius: 6,
                backgroundColor: '#F5F8FA',
                flexWrap: 'wrap',
              }),
            }}
            theme={(theme) => {
              return {
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: '#F2F3F5',
                  primary: '#2560AA',
                },
              };
            }}
            className="w-full border rounded-md bg-transparent text-sm focus:outline-none custom-scrollbar min-h-[44px]"
          />
        ) : this.props.type == 'Async' ? (
          <AsyncSelect
            id={this.props.id}
            required={this.props.required}
            options={this.props.options}
            isMulti={this.props.isMulti}
            name={this.props.name}
            placeholder={this.props.placeholder}
            value={this.props.value}
            loadOptions={this.props.loadOptions}
            formatOptionLabel={this.props.formatOptionLabel}
            onChange={this.handleChange}
            components={{
              Control: ({ children, ...props }) => {
                return (
                  <components.Control {...props}>
                    {children}
                    {this.props.suffix ?? <></>}
                  </components.Control>
                );
              },
            }}
            defaultValue={this.props.defaultValue}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: this.props.isCompact ? 34 : 44,
                maxHeight: this.props.isCompact ? 34 : 44,
                border: 'none',
                outline: 'none',
                borderRadius: 6,
                backgroundColor: '#F5F8FA',
                flexWrap: 'wrap',
              }),
            }}
            theme={(theme) => {
              return {
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: '#F2F3F5',
                  primary: '#2560AA',
                },
              };
            }}
            className={`w-full border rounded-md bg-transparent text-sm focus:outline-none custom-scrollbar items-center `}
          />
        ) : (
          <Select
            id={this.props.id}
            required={this.props.required}
            options={this.props.options}
            isMulti={this.props.isMulti}
            name={this.props.name}
            placeholder={this.props.placeholder}
            value={this.props.value}
            formatOptionLabel={this.props.formatOptionLabel}
            onChange={this.handleChange}
            defaultValue={this.props.defaultValue}
            components={{
              Control: ({ children, ...props }) => {
                return (
                  <components.Control {...props}>
                    {children}
                    {this.props.suffix ?? <></>}
                  </components.Control>
                );
              },
            }}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: this.props.isCompact ? 34 : 44,
                maxHeight: this.props.isCompact ? 34 : 44,
                border: 'none',
                outline: 'none',
                borderRadius: 6,
                backgroundColor: '#F5F8FA',
                flexWrap: 'wrap',
              }),
            }}
            theme={(theme) => {
              return {
                ...theme,
                borderRadius: 0,
                colors: {
                  ...theme.colors,
                  primary25: '#F2F3F5',
                  primary: '#2560AA',
                },
              };
            }}
            className={`w-full border rounded-md bg-transparent text-sm focus:outline-none custom-scrollbar `}
          />
        )}
      </div>
    );
  }
}

// const Selector = ({ className, ...props }: SelectorProps) => {
//   const customStyles = {
//     control: (base: any) => ({
//       ...base,
//       height: 44,
//       minHeight: 44,
//       width: 100,
//     }),
//   };
//   return (
//     <div className={`flex flex-col last-of-type:mb-0 ` + className}>
//       {props.label ? (
//         <label htmlFor={props.id} className="text-sm mb-2 text-dark-500">
//           {props.label}
//         </label>
//       ) : (
//         <></>
//       )}
//       {
//         <Creatable
//           id={props.id}
//           isClearable
//           required={props.required}
//           options={props.options}
//           isMulti={props.isMulti}
//           name={props.name}
//           placeholder={props.placeholder}
//           formatOptionLabel={props.formatOptionLabel}
//           styles={{
//             control: (base) => ({
//               ...base,
//               minHeight: 44,
//               border: 'none',
//               outline: 'none',
//               borderRadius: 6,
//               backgroundColor: '#F5F8FA',
//               flexWrap: 'wrap',
//             }),
//           }}
//           theme={(theme) => {
//             return {
//               ...theme,
//               borderRadius: 0,
//               colors: {
//                 ...theme.colors,
//                 primary25: '#F2F3F5',
//                 primary: '#2560AA',
//               },
//             };
//           }}
//           className="w-full border rounded-md bg-slate-50 text-sm focus:outline-none custom-scrollbar"
//         />
//       }
//     </div>
//   );
// };

export default SelectorV2;
