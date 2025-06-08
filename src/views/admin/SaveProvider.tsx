import { useEffect, useState, type FormEvent } from 'react'
import TagSelector from '../../components/TagSelector'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'

export default function SaveProvider () {
  const [brands, setBrands] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [formValues, setFormValues] = useState<any>({ name: '', webpage: '' })

  const navigate = useNavigate()
  const location = useLocation()
  const isEdit = location.state?.mode === 'edit'
  const providerData = location.state?.provider || {}

  useEffect(() => {
    if (isEdit && providerData) {
      setFormValues({
        name: providerData.name || '',
        webpage: providerData.webpage || ''
      })
      setTags(providerData.tags || [])
      setBrands(providerData.brands || [])
    }
  }, [isEdit, providerData])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const loading = toast.loading(
      isEdit ? 'Actualizando...' : 'Subiendo los datos...'
    )
    const formData = new FormData()

    const form = e.currentTarget
    formData.append('name', form.provider_name.value)
    formData.append('webpage', form.webpage.value)
    tags.forEach(tag => formData.append('tags[]', tag))
    brands.forEach(brand => formData.append('brands[]', brand))

    const files = form.files.files
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }

    const axiosCall = isEdit
      ? axios.put(
          `${import.meta.env.VITE_API_URL}/admin/update/${providerData.id}`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
        )
      : axios.post(`${import.meta.env.VITE_API_URL}/admin/save`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

    axiosCall
      .then(() => {
        toast.dismiss(loading)
        toast.success(isEdit ? 'Proveedor actualizado' : 'Proveedor guardado')
        navigate('/admin/providers')
      })
      .catch(error => {
        toast.dismiss(loading)
        toast.error('Error al guardar los datos')
        console.error(error)
      })
  }

  return (
    <>
      <h2>{isEdit ? 'Editar proveedor' : 'Registro de proveedores'}</h2>

      <form method='post' className='provider-form' onSubmit={handleSubmit}>
        <div className='container-form-inputs'>
          <label htmlFor='name' className='input-group'>
            <input
              type='text'
              name='provider_name'
              id='name'
              required
              defaultValue={formValues.name}
            />
            <span className='placeholder'>Nombre del proveedor</span>
          </label>

          <label htmlFor='webpage' className='input-group'>
            <input
              type='text'
              name='webpage'
              id='webpage'
              required
              defaultValue={formValues.webpage}
            />
            <span className='placeholder'>Sitio web del proveedor</span>
          </label>
        </div>

        <div className='container-form-inputs'>
          <TagSelector
            placeholder='Marcas del proveedor'
            onChange={setBrands}
            id='brands'
            initialTags={brands}
          />
          <TagSelector
            placeholder='Etiquetas'
            id='tags'
            onChange={setTags}
            initialTags={tags}
          />
        </div>

        <div className='file-group'>
          <label htmlFor='files'>Ingresa los archivos que requieres</label>
          <input type='file' name='files' id='files' multiple />
        </div>

        <button type='submit' className='primary-btn'>
          {isEdit ? 'Actualizar Ficha' : 'Guardar Ficha'}
        </button>
      </form>
    </>
  )
}
