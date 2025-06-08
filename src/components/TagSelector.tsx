import React, { useEffect, useState } from 'react'
import '../css/components/TagInput.css'

interface TagSelectorProps {
  placeholder?: string
  onChange?: (tags: string[]) => void
  id?: string
  initialTags?: string[]
}
export default function TagSelector ({
  placeholder = '',
  onChange,
  id = '',
  initialTags = []
}: TagSelectorProps) {
  const [input, setInput] = useState('')

  const [tags, setTags] = useState<string[]>([])
  const [error, setError] = useState('')

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = input.trim()

      if (!trimmed) return

      if (tags.includes(trimmed)) {
        setError('Este proveedor ya fue agregado.')
        return
      }

      setTags(prev => {
        const newTags = [...prev]
        newTags.push(input)

        return newTags
      })

      setInput('')
      setError('')
    }
  }

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
  }

  useEffect(() => {
    if (onChange) onChange(tags)
  }, [tags])

  useEffect(() => {
    if (JSON.stringify(tags) !== JSON.stringify(initialTags)) {
      setTags(initialTags)
    }
  }, [initialTags])

  return (
    <div className='tags-wrapper'>
      <label htmlFor={id} className='input-group'>
        <input
          type='text'
          id={id}
          value={input}
          onInput={e => {
            setInput(e.currentTarget.value)
            setError('')
          }}
          onKeyDown={addTag}
          required={tags.length === 0}
        />
        <span className='placeholder'>{placeholder}</span>
      </label>

      {error && <p className='error'>{error}</p>}

      <div className='tags'>
        {tags.map((tag, index) => (
          <div className='tag' key={index} onClick={() => removeTag(index)}>
            <span>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
