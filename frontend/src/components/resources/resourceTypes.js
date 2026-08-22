import { FileText, Play, BookOpen, GitBranch, GraduationCap, Link2 } from 'lucide-react'

export const RESOURCE_TYPES = {
  ARTICLE: { label: 'Article', icon: FileText },
  VIDEO: { label: 'Video', icon: Play },
  DOCUMENTATION: { label: 'Docs', icon: BookOpen },
  GITHUB: { label: 'GitHub', icon: GitBranch },
  COURSE: { label: 'Course', icon: GraduationCap },
  OTHERS: { label: 'Link', icon: Link2 },
  
}