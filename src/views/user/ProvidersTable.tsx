import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ArrowBigDownDash, Eye } from 'lucide-react'

export default function ProvidersTable () {
  type Provider = {
    id: number
    name: string
    files: string[]
    tags: string[]
    brands: string[]
    webpage: string[]
  }

  const [searchBy, setSearchBy] = useState<'name' | 'tags' | 'brands'>('name')

  const [providers, setProviders] = useState<Provider[]>([])
  const [originalProviders, setOriginalProviders] = useState<Provider[]>([])
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const loading = toast.loading('Cargando datos de proveedores...')
    axios
      .get(`${import.meta.env.VITE_API_URL}/providers/`)
      .then(res => {
        setProviders(res.data)
        setOriginalProviders(res.data)
        toast.dismiss(loading)
      })
      .catch(() => {
        toast.dismiss(loading)
        toast.error('Error al cargar proveedores')
      })
  }, [])
  const startSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    setSearchValue(value)

    if (value === '') {
      setProviders(originalProviders)
      return
    }

    const filtered = originalProviders.filter(provider => {
      if (searchBy === 'name') {
        return provider.name.toLowerCase().includes(value)
      } else if (searchBy === 'tags') {
        return provider.tags.some(tag => tag.toLowerCase().includes(value))
      } else if (searchBy === 'brands') {
        return provider.brands.some(brand =>
          brand.toLowerCase().includes(value)
        )
      }
      return false
    })

    setProviders(filtered)
  }

  const downloadFiles = async (id: number, files: string[]) => {
    if (!files || files.length === 0) {
      toast.error('Este proveedor no tiene archivos disponibles')
      return
    }

    let url: string | null = null
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/files`,
        {
          params: { id },
          responseType: 'blob'
        }
      )
      const blob = new Blob([response.data], { type: 'application/zip' })
      url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `proveedor.zip`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Archivos descargados correctamente')
    } catch (err) {
      toast.error('No se pudieron descargar los archivos')
      console.log(err)
    } finally {
      if (url) {
        window.URL.revokeObjectURL(url)
      }
    }
  }

  return (
    <>
      <div className='container-top-bar'>
        <label htmlFor='column' className='input-group'>
          <select
            className='search-select'
            value={searchBy}
            onChange={e =>
              setSearchBy(e.target.value as 'name' | 'tags' | 'brands')
            }
            required
            defaultValue={''}
          >
            <option value='name'>Nombre</option>
            <option value='tags'>Etiquetas</option>
            <option value='brands'>Marcas</option>
          </select>
        </label>
        <label htmlFor='search' className='input-group'>
          <input
            type='text'
            id='search'
            onChange={startSearch}
            value={searchValue}
            required
            className='search'
          />
          <span className='placeholder'>Buscar...</span>
        </label>
      </div>

      <div className='table-wraper'>
        <table>
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Etiquetas</th>
              <th>Marcas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {providers.map(provider => (
              <tr key={provider.id}>
                <td>
                  <b>{provider.name}</b>
                </td>
                <td>
                  <div className='tags'>
                    {provider.tags.map((tag, idx) => (
                      <div className='tag' key={`${tag}-${idx}`}>
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className='tags'>
                    {provider.brands.map((brand, idx) => (
                      <div className='tag' key={`${brand}-${idx}`}>
                        <span>{brand}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div className='actions'>
                    <button
                      onClick={() => downloadFiles(provider.id, provider.files)}
                      className='cell-btn'
                    >
                      <ArrowBigDownDash />
                    </button>
                    <a
                      href={`https://${provider.webpage}`}
                      target='_BLANK'
                      className='cell-btn'
                    >
                      <Eye />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
