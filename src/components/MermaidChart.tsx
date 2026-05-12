import { useEffect, useMemo, useState } from 'react'
import mermaid from 'mermaid'
import { Box, Text } from '@nimbus-ds/components'

type MermaidChartProps = {
  chart: string
  themeMode: 'light' | 'dark'
}

export function MermaidChart({ chart, themeMode }: MermaidChartProps) {
  const chartId = useMemo(
    () => `mermaid-${Math.random().toString(36).slice(2)}`,
    [],
  )
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const normalizedChart = useMemo(() => normalizeMermaid(chart), [chart])

  useEffect(() => {
    let cancelled = false
    setError(null)

    mermaid.initialize({
      startOnLoad: false,
      theme: themeMode === 'dark' ? 'dark' : 'default',
    })

    const render = async () => {
      try {
        const { svg: rendered } = await mermaid.render(chartId, normalizedChart)
        if (!cancelled) {
          setSvg(rendered)
        }
      } catch (err) {
        console.error('Mermaid render failed', err)
        if (!cancelled) {
          setError('Falha ao renderizar grafico Mermaid.')
        }
      }
    }

    render()

    return () => {
      cancelled = true
    }
  }, [chartId, normalizedChart, themeMode])

  return (
    <Box className="na-mermaid-card">
      {error ? (
        <Text className="na-md-p">{error}</Text>
      ) : (
        <Box
          className="na-mermaid"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </Box>
  )
}

function normalizeMermaid(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return input

  const lines = trimmed.split(/\r?\n/).map((line) => line.trim())
  if (!lines[0]) return input

  const header = lines[0].toLowerCase()
  const mermaidHeaders = new Set([
    'flowchart',
    'graph',
    'sequenceDiagram',
    'classDiagram',
    'stateDiagram',
    'stateDiagram-v2',
    'erDiagram',
    'journey',
    'gantt',
    'pie',
    'gitGraph',
    'mindmap',
    'timeline',
    'xychart-beta',
    'quadrantChart',
    'requirementDiagram',
    'sankey-beta',
    'c4Context',
    'c4Container',
    'c4Component',
    'c4Deployment',
  ])

  if (header.startsWith('pie')) {
    return normalizePie(lines)
  }

  const isBarHeader = /^bar(\b|:|\s)/i.test(header)
  const hasQuotedPairs = lines.some((line, index) => {
    if (index === 0) return false
    if (!line) return false
    if (/^(x-axis|y-axis)\b/i.test(line)) return false
    return /^"?.+"?\s*[:=-]?\s*-?\d+(?:\.\d+)?$/.test(line)
  })

  if (!isBarHeader && (mermaidHeaders.has(header) || !hasQuotedPairs)) {
    return input
  }

  let title = 'Grafico'
  let axisLabel = 'Valores'
  const categories: string[] = []
  const values: number[] = []

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i]
    if (!line) continue

    if (/^title\b/i.test(line)) {
      title = line.replace(/^title\b\s*:?/i, '').trim() || title
      continue
    }

    if (/^(y-axis|axis|label)\b/i.test(line)) {
      axisLabel = line.replace(/^(y-axis|axis|label)\b\s*:?/i, '').trim() || axisLabel
      continue
    }

    if (categories.length === 0 && values.length === 0 && !line.includes('"')) {
      axisLabel = line
      continue
    }

    const match = line.match(/^"?(.+?)"?\s*[:=-]?\s*(-?\d+(?:\.\d+)?)$/)
    if (match) {
      categories.push(match[1])
      values.push(Number(match[2]))
    }
  }

  const safeCategories = categories.length > 0 ? categories : ['Item']
  const safeValues = values.length > 0 ? values : [0]
  const maxValue = Math.max(...safeValues)
  const yMax = maxValue > 0 ? Math.ceil(maxValue * 1.2) : 1

  return [
    'xychart-beta',
    `title "${title}"`,
    `x-axis [${safeCategories.map((c) => `"${c}"`).join(', ')}]`,
    `y-axis "${axisLabel}" 0 --> ${yMax}`,
    `bar [${safeValues.join(', ')}]`,
  ].join('\n')
}

function normalizePie(lines: string[]): string {
  const output: string[] = []
  output.push(lines[0])

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim()
    if (!line) continue

    if (/^title\b/i.test(line)) {
      output.push(line.replace(/^title\b\s*:?/i, 'title '))
      continue
    }

    const match = line.match(/^"?(.+?)"?\s*[:=-]?\s*(-?\d+(?:\.\d+)?)$/)
    if (match) {
      output.push(`"${match[1]}" : ${match[2]}`)
      continue
    }

    output.push(line)
  }

  return output.join('\n')
}
