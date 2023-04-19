import { v4 as uuidv4 } from "uuid";
import {useEffect, useState} from "react";
import {fileSizesToString, fileTypesToString, useMedia} from "../../../hooks/media-hook";
import {UploaderMessage} from "../Common/UploaderMessage";

export const MediaUploader = ({files,maxSize,initialUrl,updateBackendUrl,isMultiple=false,updateImage,showUploadMessage=true,...props}) => {
    const {fileObjs,dragStatus, dragHandlers, inputHandlers} = useMedia(files,initialUrl,isMultiple,updateBackendUrl);
    const id = uuidv4();
    const [imageDetails,setImageDetails] = useState({})
    useEffect(()=>{
        if (fileObjs){
            if (isMultiple) {
                console.log('fileObjs', fileObjs);
                updateImage(fileObjs)
            }
            else if (fileObjs[0]?.file) {
                console.log('true')
                updateImage(fileObjs[0].file)
                setImageDetails({
                    messageType:fileObjs[0].message?.type||'',
                    message:fileObjs[0].message?.value||'',
                    size:fileObjs[0].size
                })
            }
        }
    },[fileObjs])

    return (
        <div className={''} {...props}>
            <div className='td-media-uploader-wrapper my-3' {...dragHandlers}>
                <input id={id} type="file" multiple={isMultiple} {...inputHandlers}/>
                {isMultiple
                    ? fileObjs[0]?.url
                        ? fileObjs.map((obj,idx) => <div key={idx} className="td-media-wrapper" >
                            <img className={'td-media-img'} src={obj.url} alt=""/>
                        </div>)
                        : <div className={'td-no-media'}>
                            {/*<p>Add a {title}</p>*/}
                            <p>Drop your {fileTypesToString(files)} here. or <label htmlFor={id}>Browse</label></p>
                            <p>{fileSizesToString(files)}</p>
                        </div>
                    : fileObjs[0]?.url
                        ? <div className="td-media-wrapper" >
                                <img className={'td-media-img'} src={fileObjs[0]?.url} alt=""/>
                            </div>
                        : <div className={'td-no-media'}>
                            {/*<p>Add a {title}</p>*/}
                            <p>Drop your {fileTypesToString(files)} here. or <label htmlFor={id}>Browse</label></p>
                            <p>{fileSizesToString(files)}</p>
                        </div>
                }
            </div>
            {imageDetails && showUploadMessage && <UploaderMessage
                maxSize={maxSize}
                size={imageDetails.size}
                type={imageDetails.messageType}
                message={imageDetails.message}
            />}
        </div>
    )
}