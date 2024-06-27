import { useState } from "react";
import axios from "axios";
export default function PhotosUploader({addedPhotos, onChange}) {
    const [photoLink, setPhotoLink] = useState("");
    async function addPhotoByLink(e) {
        e.preventDefault();
        const { data: filename } = await axios.post('upload-by-link', {
            link: photoLink
        })
        onChange(prev => { return [...prev, filename] });
        setPhotoLink('');
    }

    function uploadPhoto(e) {
        e.preventDefault();
        const files = e.target.files
        const data = new FormData();
        // for (const file of files) {
        //     data.append('photos', file)            
        // }
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i])
        }
        // data.set('photos[]',files);
        axios.post('/upload', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(response => {
            const { data: filenames } = response;
            // console.log('response', data);
            onChange(prev => {
                return [...prev, ...filenames]
            });
        })
    }
    return (
        <>
            <div className='flex gap-2'>
                <input
                    type='text'
                    placeholder='Add photo URL'
                    value={photoLink}
                    onChange={(e) => setPhotoLink(e.target.value)}
                />
                <button className='bg-gray-200 px-4 rounded-2xl'
                    onClick={addPhotoByLink}>
                    Add&nbsp;Photo
                </button>
            </div>
            <div className='mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
                {addedPhotos.length > 0
                    && addedPhotos.map(link => (
                        <div className="h-32 flex" key={link}>
                            <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/' + link} alt={link} />
                        </div>
                    ))}
                <label className='h-32 cursor-pointer flex gap-1 items-center justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600'>
                    <input type="file" multiple className="hidden" onChange={uploadPhoto} />

                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-8 w-8'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z'
                        />
                    </svg>
                    Upload
                </label>
            </div>
        </>
    );
}