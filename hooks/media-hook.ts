import {capitalize, difference, indexOf} from "lodash";
import {v4 as uuidv4} from "uuid";
import {ChangeEvent, DragEvent, useEffect, useReducer, useState} from "react";

type SizeUnit = "Bytes" | "KB" | "MB" | "GB";
export type MessageType = "warning" | "info" | "error" | "success";
export type StorageUploaderStatus = "uploading" | "idle";
export type Message = { type: MessageType, value: string }
export type DragStatus = "invalid" | "valid" | "idle"
type FileType = "video" | "file" | "image" | "audio" | "example" | "font" | "model" | "text"
export type AllowableFile = { formats: string[], maxSize: number, type: FileType }
export type AllowableFiles = AllowableFile[]
export type UpdateBackendUrl = (newUrl: string) => Promise<any>
export type UpdateBackendUrls = (newUrl: string[]) => Promise<any>
export type FileObj = {
    _id: string,
    name: string
    message: Message,
    progress: number,
    status: 'uploading' | 'idle' | 'new',
    url: string,
    file: File,
    size: number,
    type: string,
    format: string
}
type AddFileAction = {
    type: "ADD_FILE",
    payload: FileObj
}
type UpdateFileAction = {
    type: "UPDATE_FILE",
    payload: Partial<Omit<FileObj, '_id'>> & { _id: string }
}
type DeleteFileAction = {
    type: "DELETE_FILE",
    payload: string
}
type StorageAction = AddFileAction | UpdateFileAction | DeleteFileAction;

const reducer = (state: FileObj[] = [], action: StorageAction): FileObj[] => {
    switch (action.type) {
        case 'ADD_FILE':
            return [...state, action.payload]
        case 'UPDATE_FILE':
            return state.map(fileObj => fileObj._id === action.payload._id ? {...fileObj, ...action.payload} : fileObj)
        case 'DELETE_FILE':
            return state.filter(fileObj => fileObj._id !== action.payload)
        default:
            return state
    }
}
//action creators
const addFileAction = (fileObj: FileObj): AddFileAction => ({type: 'ADD_FILE', payload: fileObj})
const updateFileAction = (fileObj: Partial<Omit<FileObj, '_id'>> & { _id: string }): UpdateFileAction => ({
    type: 'UPDATE_FILE',
    payload: fileObj
})
const deleteFileAction = (_id: string): DeleteFileAction => ({type: 'DELETE_FILE', payload: _id})

//Helpers
export const fileFormatsToString = (formats: string[]) =>
    formats.reduce((acc, elem) => (acc ? `${acc}, .${elem}` : `.${elem}`), "");

export const sizeToString = (bytes: number): string => bytes / 1024 < 1
    ? `${bytes.toPrecision(4)} Bytes`
    : bytes / 1024 / 1024 < 1
        ? `${(bytes / 1024).toPrecision(4)} KB`
        : (bytes / 1024 / 1024 / 1024 < 1)
            ? `${(bytes / 1024 / 1024).toPrecision(4)} MB`
            : `${(bytes / 1024 / 1024 / 1024).toPrecision(4)} GB`
const MIMEType = (MIME: string) => MIME.split("/")[0] === "application" ? "file" : MIME.split("/")[0] || "";
const MIMEFormat = (MIME: string) => MIME.split("/")[1] || "";
const handleDirSlash = (dir: string) => dir.slice(-1) === "/" ? dir : dir + "/";

export const fileTypesToString = (validations: AllowableFiles): string => validations.reduce((acc, elem) => acc ? `${acc} or ${elem.type}` : elem.type, '');
export const fileSizesToString = (validations: AllowableFiles): string =>
    validations.reduce((acc, elem) => acc ? `${acc} , ${capitalize(elem.type)} max size of ${sizeToString(elem.maxSize)}`
        : `${capitalize(elem.type)} max size of ${sizeToString(elem.maxSize)}`, '')
//Messages
const messages = {
    info: {
        recommendedSizes: (filesValidations: AllowableFiles): Message => ({
            value: `Upload ( ${filesValidations.reduce((acc, {
                type,
                maxSize
            }) => `${acc}${acc && ", "}${type} ≤ ${sizeToString(maxSize)}`, "")} ).`, type: "info"
        }),
        uploadingPercentage: (percent: number): Message => ({
            value: `uploading... ${Math.round(percent)}%`,
            type: "info"
        }),
        uploadingToStore: (fileType: string): Message => ({
            value: `${capitalize(fileType)} uploaded to store...`,
            type: "info"
        }),
        deletingFile: (fileType: string): Message => ({
            value: `Deleting ${capitalize(fileType)}...`,
            type: "info"
        }),
    },
    error: {
        internetFailure: (fileType: string): Message => ({
            value: `failed to upload ${fileType} check your internet connection`,
            type: "error"
        }),
        wrongFileFormat: (fileFormat: string): Message => ({
            value: `${fileFormat} file format is not allowed`,
            type: "error"
        }),
    },
    warning: {
        overSized: (fileType: string, fileSize: number, maxSize: number): Message => ({
            value: `${capitalize(fileType)} is ${sizeToString(fileSize)}, Recommended maximum size is ${sizeToString(maxSize)}`,
            type: "warning"
        }),
        cantGetFileSize: (): Message => ({value: `can't get file size check your network`, type: "warning"})
    },
    success: {
        nicelySized: (fileType: string, fileSize: number, maxSize: number): Message => ({
            value: `${capitalize(fileType)} is Perfectly sized ${sizeToString(fileSize)}, Recommended maximum size is ${sizeToString(maxSize)}`,
            type: "success"
        })
    }
}

const createFileObj = (file: File): FileObj => ({
    url: '',
    name: file.name,
    type: MIMEType(file.type),
    _id: uuidv4(),
    status: 'uploading',
    file: null,
    progress: 0,
    size: file.size,
    message: messages.info.uploadingPercentage(0),
    format: MIMEFormat(file.type),
})

export const useMedia = (allowableFiles: AllowableFiles, initLinks = [""], isMultiple: boolean, onSuccess: (newLinks: string[]) => Promise<any>) => {
    const [fileObjs, dispatch] = useReducer(reducer, initLinks.map<FileObj>(url => ({
        url,
        name: '',
        type: '',
        _id: uuidv4(),
        status: 'new',
        file:null,
        progress: NaN,
        size: NaN,
        message: {type: 'info', value: ''},
        format: ''
    })))
    //state
    const [dragStatus, setDragStatus] = useState<DragStatus>("idle");
    //mini helper

    useEffect(()=>{
        for (const fileObj of fileObjs) {
            if (fileObj.url && fileObj.status === 'new') {
                try {
                    // @ts-ignore
                    const maxSize = allowableFiles.find((x) => x.type === fileObj.type)?.maxSize || 0;
                    dispatch(updateFileAction({
                        ...fileObj,
                        status: 'idle',
                        message: fileObj.size > maxSize
                            ? messages.warning.overSized(fileObj.type, fileObj.size, maxSize)
                            : messages.success.nicelySized(fileObj.type, fileObj.size, maxSize)
                    }))
                }
                catch (e) {
                    dispatch(updateFileAction({
                        _id: fileObj._id,
                        message: messages.warning.cantGetFileSize()
                    }))
                }
            }
        }

    },[fileObjs,allowableFiles])
    const allowableFormats = allowableFiles.reduce<string[]>((acc, elem) => [...acc, ...elem.formats], [])

    const uploadMultipleFiles = async (files: FileList) => {
        // adding fileObjs to the UI
        // const newFileObj: FileObj = fileObjs.length
        //     ? {...fileObjs[0], status: "uploading", progress: 0, message: messages.info.uploadingPercentage(0)}
        //     : createFileObj(file);

        const newFilesObjs: FileObj[] = [];
        for (let i = 0; i < files.length; i++) {
            newFilesObjs.push(createFileObj(files[i]))
        }
        console.log(newFilesObjs)
        newFilesObjs.map((file) => {
            dispatch(addFileAction(file));
        })
        Object.values(files).map((file,idx) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            let newUrl;
            fileReader.onprogress = (snapShot) => {
                const percentageUpload = snapShot.loaded / snapShot.total * 100;
                newUrl = fileReader.result
                // let str = snapShot.target.result.substring(indexOf(':')+1,indexOf('/')+1)
                dispatch(updateFileAction({
                    _id: newFilesObjs[idx]._id,
                    size: snapShot.total,
                    url: newUrl,
                    file,
                    // type: str,
                    progress:percentageUpload,
                    message:messages.info.uploadingPercentage(percentageUpload)
                }));
            }
            fileReader.onerror = (error) => {
                dispatch(updateFileAction({
                    _id:newFilesObjs[idx]._id,
                    progress: NaN,
                    message: messages.error.internetFailure(file.type)
                }))
            }
            fileReader.onloadend = (snapShot) => {
                newUrl = fileReader.result
                dispatch(updateFileAction({
                    _id:newFilesObjs[idx]._id,
                    url:newUrl,
                    file,
                    type: newUrl.substring(newUrl.indexOf(':')+1,newUrl.indexOf('/')),
                    format: newUrl.substring(newUrl.indexOf('/')+1,newUrl.indexOf(';')),
                    status:"new",
                    progress:NaN
                }))
                try {
                    onSuccess(newUrl)
                } catch (e) {}
            }

        });
        //#region old logic
        // Uploading to firebase storage
        // const storageRefs = newFilesObjs.map(fileObj => storage.ref(`${handleDirSlash(storageDir)}${fileObj.name}`));
        // const tasks = storageRefs.map((storageRef, i) => storageRef.put(files[i]));
        // // Updating each file status
        // tasks.map((task, i) => task.on("state_changed",
        //         function progress(snapshot) {
        //             const percentageUpload = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        //             dispatch(updateFileAction({
        //                 _id: newFilesObjs[i]._id,
        //                 progress: percentageUpload,
        //                 message: messages.info.uploadingPercentage(percentageUpload)
        //             }))
        //         },
        //         function error() {
        //             dispatch(updateFileAction({
        //                 _id: newFilesObjs[i]._id,
        //                 progress: NaN,
        //                 message: messages.error.internetFailure(newFilesObjs[i].type)
        //             }))
        //             setTimeout(() => {
        //                 dispatch(deleteFileAction(newFilesObjs[i]._id))
        //             }, 2000);
        //         },
        //     )
        // )
        // try {
        //     await Promise.all(tasks);
        //     const newUrls = await Promise.all(storageRefs.map((storageRef) => storageRef.getDownloadURL()));
        //     await onSuccess([...fileObjs.filter(fileObj => fileObj.url).map(fileObj => fileObj.url), ...newUrls]);
        //     newUrls.map((url, i) => dispatch(updateFileAction({
        //         _id: newFilesObjs[i]._id,
        //         url,
        //         status: "new",
        //         progress: NaN
        //     })));
        // } catch (e) {
        //     newFilesObjs.map(fileObj => dispatch(updateFileAction({
        //         _id: fileObj._id,
        //         progress: NaN,
        //         message: messages.error.internetFailure(fileObj.type)
        //     })))
        // }
        //#endregion

    }

    // @ts-ignore
    const uploadSingleFile = async (file: File) => {
        //update UI
        const newFileObj: FileObj = fileObjs.length
            ? {...fileObjs[0], status: "uploading", progress: 0, message: messages.info.uploadingPercentage(0)}
            : createFileObj(file);
        fileObjs.length ? dispatch(updateFileAction(newFileObj)) : dispatch(addFileAction(newFileObj));
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        let newUrl;
        fileReader.onprogress = (snapShot) => {
            const percentageUpload = snapShot.loaded / snapShot.total * 100;
            newUrl = fileReader.result
            // let str = snapShot.target.result.substring(indexOf(':')+1,indexOf('/')+1)
            dispatch(updateFileAction({
                _id: newFileObj._id,
                size: snapShot.total,
                url: newUrl,
                file,
                // type: str,
                progress:percentageUpload,
                message:messages.info.uploadingPercentage(percentageUpload)
            }));
        }
        fileReader.onerror = (error) => {
            dispatch(updateFileAction({
                _id:newFileObj._id,
                progress: NaN,
                message: messages.error.internetFailure(newFileObj.type)
            }))
        }
        fileReader.onloadend = (snapShot) => {
            newUrl = fileReader.result
            dispatch(updateFileAction({
                _id:newFileObj._id,
                url:newUrl,
                file,
                type: newUrl.substring(newUrl.indexOf(':')+1,newUrl.indexOf('/')),
                format: newUrl.substring(newUrl.indexOf('/')+1,newUrl.indexOf(';')),
                status:"new",
                progress:NaN
            }))
            try {
                onSuccess(newUrl)
            } catch (e) {}
        }
    }

    // const deleteHandlerCreator = (id: string) => async () => {
    //     // const fileObj = fileObjs.find((obj) => obj._id === id)
    //     // if (fileObj) {
    //     //     dispatch(updateFileAction({
    //     //         _id: fileObj._id,
    //     //         message: messages.info.deletingFile(fileObj.type)
    //     //     }))
    //     //     //@ts-ignore
    //     //     isMultiple ? await onSuccess(fileObjs.filter(obj => obj._id !== id && obj.url).map(obj => obj.url)) : await onSuccess('')
    //     //     dispatch(deleteFileAction(id))
    //     //     try {
    //     //         const ref = storage.refFromURL(fileObj.url);
    //     //         await ref.delete()
    //     //     } catch (e) {
    //     //     }
    //     // }
    // }
    const inputHandlers = {
        accept: allowableFiles.reduce((acc, elem) => acc ? acc + ', ' + fileFormatsToString(elem.formats) : fileFormatsToString(elem.formats), ''),
        type: "file",
        onChange(e: ChangeEvent<HTMLInputElement>) {
            if (e.target.files) {
                isMultiple ? uploadMultipleFiles(e.target.files) : uploadSingleFile(e.target.files[0])
                // uploadSingleFile(e.target.files[0])
            }
        },
        multiple: isMultiple,
        style: {
            display: "none"
        }
    }
    const dragHandlers = {
        onDragOver(e: DragEvent<HTMLDivElement>) {
            e.preventDefault();
            const fileFormats: string[] = [];
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                fileFormats.push(MIMEFormat(e.dataTransfer.items[i].type))
            }
            const isValidFormats = difference(fileFormats, allowableFormats).length === 0;
            if (isValidFormats) {
                if (dragStatus !== "valid") {
                    setDragStatus("valid");
                }
            } else {
                if (dragStatus !== "invalid") {
                    setDragStatus("invalid");
                }
            }
        },
        onDragLeave(e: DragEvent<HTMLDivElement>) {
            setDragStatus("idle")
        },
        onDrop(e: DragEvent<HTMLDivElement>) {
            e.preventDefault();
            setDragStatus("idle")
            const fileFormats: string[] = [];
            for (let i = 0; i < e.dataTransfer.items.length; i++) {
                fileFormats.push(MIMEFormat(e.dataTransfer.items[i].type))
            }
            const isValidFormats = difference(fileFormats, allowableFormats).length === 0;
            if (isValidFormats) {
                isMultiple ? uploadMultipleFiles(e.dataTransfer.files) : uploadSingleFile(e.dataTransfer.files[0])
                // uploadSingleFile(e.dataTransfer.files[0])
            }
        },
        ["data-drag-status"]: dragStatus
    }

    return {
        fileObjs,
        dragStatus,
        // deleteHandlerCreator,
        dragHandlers,
        inputHandlers
    }

}
