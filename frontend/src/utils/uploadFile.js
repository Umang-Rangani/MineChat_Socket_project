import { axiosInstance } from "../config/axiosConfig"

export const uploadFile = async (filename, file, folder) => {
  if (!file) {
    throw new Error('File is required')
  }

  try {
    const formData = new FormData()

    // formData.append('key', value)
    formData.append('filename', filename)
    formData.append('uploadFolder', folder)
    formData.append('file', file)

    const { data } = await axiosInstance.post('/uploads', formData)

    if (!data?.filePath) {
      throw new Error('File upload failed: file path not returned')
    }

    return data.filePath
  } catch (error) {
    console.error('File upload failed:', error.response?.data || error.message)

    throw error
  }
}


export const deleteFile = async (filePath) => {
  if (!filePath) {
    throw new Error('File path is required')
  }

  try {
    const { data } = await axiosInstance.delete('/uploads', {
      data: {
        filePath: filePath,
      },
    })

    return data
  } catch (error) {
    console.error(
      'File delete failed:',
      error.response?.data || error.message
    )

    throw error
  }
}