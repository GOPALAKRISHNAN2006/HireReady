import { useState, useEffect } from 'react'
import { Card, Button, Badge } from '../components/ui'
import toast from 'react-hot-toast'
import {
  StickyNote,
  Plus,
  Search,
  Trash2,
  Edit3,
  Save,
  X,
  Tag,
  Clock,
  Star,
  StarOff,
  Filter,
  FileText,
  Code2,
  Brain,
  Building2,
  MessageSquare,
  ChevronDown,
  BookOpen,
  Pin,
  PinOff
} from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'All Notes', icon: StickyNote, color: 'gray' },
  { id: 'dsa', label: 'DSA', icon: Code2, color: 'green' },
  { id: 'behavioral', label: 'Behavioral', icon: Brain, color: 'purple' },
  { id: 'system-design', label: 'System Design', icon: Building2, color: 'blue' },
  { id: 'company', label: 'Company Notes', icon: Building2, color: 'orange' },
  { id: 'general', label: 'General', icon: FileText, color: 'gray' },
]

const COLORS = [
  { id: 'white', bg: 'bg-white dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' },
  { id: 'yellow', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-700/50' },
  { id: 'blue', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700/50' },
  { id: 'green', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700/50' },
  { id: 'purple', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700/50' },
  { id: 'pink', bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-200 dark:border-pink-700/50' },
]

const InterviewNotes = () => {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('hireready-notes')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [editingNote, setEditingNote] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'general',
    color: 'white',
    tags: [],
    pinned: false,
    starred: false,
  })
  const [tagInput, setTagInput] = useState('')

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('hireready-notes', JSON.stringify(notes))
  }, [notes])

  const createNote = () => {
    if (!newNote.title.trim()) {
      toast.error('Please add a title')
      return
    }
    const note = {
      ...newNote,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes(prev => [note, ...prev])
    setNewNote({ title: '', content: '', category: 'general', color: 'white', tags: [], pinned: false, starred: false })
    setIsCreating(false)
    toast.success('Note created!')
  }

  const updateNote = (id, updates) => {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
    ))
  }

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    toast.success('Note deleted')
  }

  const togglePin = (id) => {
    const note = notes.find(n => n.id === id)
    updateNote(id, { pinned: !note.pinned })
  }

  const toggleStar = (id) => {
    const note = notes.find(n => n.id === id)
    updateNote(id, { starred: !note.starred })
  }

  const addTag = (noteId) => {
    if (!tagInput.trim()) return
    const note = notes.find(n => n.id === noteId)
    if (note && !note.tags.includes(tagInput.trim())) {
      updateNote(noteId, { tags: [...note.tags, tagInput.trim()] })
    }
    setTagInput('')
  }

  const removeTag = (noteId, tag) => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      updateNote(noteId, { tags: note.tags.filter(t => t !== tag) })
    }
  }

  // Filter notes
  const filteredNotes = notes
    .filter(n => activeCategory === 'all' || n.category === activeCategory)
    .filter(n => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })

  const getColorClasses = (colorId) => COLORS.find(c => c.id === colorId) || COLORS[0]

  const NoteCard = ({ note }) => {
    const colors = getColorClasses(note.color)
    const isEditing = editingNote === note.id
    const [localTitle, setLocalTitle] = useState(note.title)
    const [localContent, setLocalContent] = useState(note.content)

    return (
      <div className={`${colors.bg} ${colors.border} border rounded-xl p-5 transition-all hover:shadow-lg group relative`}>
        {/* Pin indicator */}
        {note.pinned && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-md">
            <Pin className="w-3 h-3 text-white" />
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3">
            <input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
              placeholder="Note title..."
            />
            <textarea
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm resize-none"
              placeholder="Write your notes..."
            />
            <div className="flex items-center gap-2">
              <select
                value={note.category}
                onChange={(e) => updateNote(note.id, { category: e.target.value })}
                className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
              <div className="flex gap-1">
                {COLORS.map(color => (
                  <button
                    key={color.id}
                    onClick={() => updateNote(note.id, { color: color.id })}
                    className={`w-6 h-6 rounded-full ${color.bg} ${color.border} border-2 ${note.color === color.id ? 'ring-2 ring-indigo-500' : ''}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setEditingNote(null)}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button size="sm" onClick={() => {
                updateNote(note.id, { title: localTitle, content: localContent })
                setEditingNote(null)
                toast.success('Note updated!')
              }}>
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{note.title}</h3>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => toggleStar(note.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                  {note.starred ? <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> : <StarOff className="w-4 h-4 text-slate-400" />}
                </button>
                <button onClick={() => togglePin(note.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                  {note.pinned ? <PinOff className="w-4 h-4 text-indigo-500" /> : <Pin className="w-4 h-4 text-slate-400" />}
                </button>
                <button onClick={() => setEditingNote(note.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                  <Edit3 className="w-4 h-4 text-slate-400" />
                </button>
                <button onClick={() => deleteNote(note.id)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                  <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap line-clamp-6 mb-3">
              {note.content || 'No content'}
            </p>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {note.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
              <Badge variant="default" className="text-xs">
                {CATEGORIES.find(c => c.id === note.category)?.label || note.category}
              </Badge>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Gradient Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-600 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        <div className="relative">
          <div className="inline-flex items-center px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <StickyNote className="w-4 h-4 mr-2" />
            Notes
          </div>
          <h1 className="text-3xl font-bold mb-2">Interview Notes</h1>
          <p className="text-white/70 max-w-lg">Organize your interview preparation notes</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setIsCreating(true)} icon={Plus}>
          New Note
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Create Note Modal */}
      {isCreating && (
        <Card>
          <Card.Content className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create New Note</h3>
            <div className="space-y-4">
              <input
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Note title..."
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-lg focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your notes here... (tips, key concepts, questions to review, etc.)"
                rows={8}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Category</label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Color</label>
                  <div className="flex gap-2">
                    {COLORS.map(color => (
                      <button
                        key={color.id}
                        onClick={() => setNewNote(prev => ({ ...prev, color: color.id }))}
                        className={`w-7 h-7 rounded-full ${color.bg} ${color.border} border-2 ${newNote.color === color.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 block">Tags</label>
                  <div className="flex gap-2">
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && tagInput.trim()) {
                          e.preventDefault()
                          if (!newNote.tags.includes(tagInput.trim())) {
                            setNewNote(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
                          }
                          setTagInput('')
                        }
                      }}
                      placeholder="Add tag..."
                      className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300"
                    />
                  </div>
                  {newNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {newNote.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                          #{tag}
                          <button onClick={() => setNewNote(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => { setIsCreating(false); setNewNote({ title: '', content: '', category: 'general', color: 'white', tags: [], pinned: false, starred: false }) }}>
                  Cancel
                </Button>
                <Button onClick={createNote} icon={Save}>
                  Create Note
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <StickyNote className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {searchQuery ? 'Try a different search term' : 'Start taking notes to organize your interview prep'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreating(true)} icon={Plus}>
              Create Your First Note
            </Button>
          )}
        </div>
      )}

      {/* Stats */}
      {notes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{notes.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Notes</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl font-bold text-yellow-500">{notes.filter(n => n.starred).length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Starred</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl font-bold text-indigo-500">{notes.filter(n => n.pinned).length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pinned</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center">
            <p className="text-2xl font-bold text-green-500">{new Set(notes.flatMap(n => n.tags)).size}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tags Used</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default InterviewNotes
