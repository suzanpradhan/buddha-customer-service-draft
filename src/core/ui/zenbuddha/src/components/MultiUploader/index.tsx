/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */

import { FormikErrors, FormikValues } from 'formik';
import { Add, CloseCircle, DocumentText1 } from 'iconsax-react';
import { constants } from '../../core/constants';

export interface MultiUploaderType {
  id?: string;
  files?: File[];
  label?: string;
  required?: boolean;
  serverFiles?: ServerFileType[];
  name: string;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<FormikValues>> | Promise<void>;
  onServerAttachmentRemove?: (attachment: ServerFileType) => void;
}

export interface AttachmentType {
  file: File;
  onRemove: () => void;
}

export interface ServerFileType {
  id: number;
  url: string;
  file_type: string;
}

const EachAttachment = (props: AttachmentType) => {
  return (
    <div className="w-28 h-28 rounded-md bg-white cursor-pointer flex flex-col relative overflow-hidden justify-center items-center border-white border">
      {props.file.type.startsWith('image') ? (
        <img
          src={URL.createObjectURL(props.file)}
          alt="attachment"
          className="object-cover w-full"
        />
      ) : (
        <DocumentText1
          size={40}
          variant="Bold"
          color="black"
          className="flex-1"
        />
      )}
      <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-white top-0 left-0 z-10"></div>
      <p className="text-xs text-dark whitespace-nowrap text-start absolute bottom-2 left-2 z-20">
        {props.file.name}
      </p>
      <CloseCircle
        size={20}
        variant="Bold"
        color="red"
        className="absolute top-2 right-2 z-30"
        onClick={props.onRemove}
      />
    </div>
  );
};

const ServerAttachment = ({
  serverFile,
  onServerAttachmentRemove,
}: {
  serverFile: ServerFileType;
  onServerAttachmentRemove?: (attachment: ServerFileType) => void;
}) => {
  var filePathSplit = serverFile.url.split('/');
  var fileName = filePathSplit[filePathSplit.length - 1];

  return (
    <div
      className="w-28 h-28 rounded-md bg-white cursor-pointer flex flex-col relative overflow-hidden justify-center items-center border-white border"
      onClick={() => {
        if (typeof window !== 'undefined' && serverFile) {
          if (serverFile.file_type.startsWith('image')) {
            window.open(serverFile.url, '_blank')?.focus();
          } else {
            window
              .open(constants.googleDocViewerUrl + serverFile.url, '_blank')
              ?.focus();
          }
        }
      }}
    >
      {serverFile.file_type.startsWith('image') ? (
        <img
          src={serverFile.url}
          alt="attachment"
          className="object-cover w-full h-full"
        />
      ) : (
        <DocumentText1
          size={40}
          variant="Bold"
          color="black"
          className="flex-1"
        />
      )}
      <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-white top-0 left-0 z-10 pointer-events-none"></div>
      <p className="text-xs text-dark whitespace-nowrap text-start absolute bottom-2 left-2 z-20 pointer-events-none">
        {fileName}
      </p>
      <CloseCircle
        size={20}
        variant="Bold"
        color="red"
        className="absolute top-2 right-2 z-30"
        onClick={() => {
          if (!onServerAttachmentRemove) return;
          onServerAttachmentRemove(serverFile);
        }}
      />
    </div>
  );
};

const MultiUploader = (props: MultiUploaderType) => {
  return (
    <div className="flex flex-col w-full">
      {props.label ? (
        <label htmlFor={props.id} className="text-sm mb-2 text-dark-500 w-fit">
          {props.label}
          {props.required ? '*' : ''}
        </label>
      ) : (
        <></>
      )}
      <div className="bg-blueWhite border border-primaryGray-300 rounded-lg p-4 max-w-5xl max-h-96 overflow-y-auto custom-scrollbar flex flex-wrap gap-2">
        {props.serverFiles &&
          props.serverFiles.map((serverFile, index) => (
            <ServerAttachment
              key={index}
              onServerAttachmentRemove={props.onServerAttachmentRemove}
              serverFile={serverFile}
            />
          ))}

        {props.files &&
          Array.from(props.files).map((file, index) => (
            <EachAttachment
              key={index}
              file={file}
              onRemove={() => {
                if (props.files) {
                  var currentFiles = Array.from(props.files);
                  const index = currentFiles.indexOf(file);
                  if (index > -1) {
                    currentFiles.splice(index, 1);
                  }
                  props.setFieldValue(props.name, currentFiles);
                }
              }}
            />
          ))}
        <label
          htmlFor="uploader"
          className="w-28 h-28 rounded-md bg-white flex flex-col justify-center items-center overflow-hidden p-2 cursor-pointer"
        >
          <input
            type="file"
            id="uploader"
            className="hidden"
            multiple
            onChange={(e) => {
              if (!e.currentTarget.files) {
                return;
              }
              if (props.files) {
                const joined = Array.from(props.files).concat(
                  Array.from(e.currentTarget.files!)
                );
                props.setFieldValue(props.name, joined);
              } else {
                props.setFieldValue(
                  props.name,
                  Array.from(e.currentTarget.files!)
                );
              }
            }}
          />
          <Add size={54} color="black" className="flex-1" />
        </label>
      </div>
    </div>
  );
};

export default MultiUploader;
