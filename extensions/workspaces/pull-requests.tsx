import type { ConversationId } from '@earendil-works/pi-durable'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { ArrowUpRightIcon } from 'lucide-react'
import { api, cn, useConversationSummary } from '@/sdk'
import { useGithubRepo } from './landing.tsx'
import { PullRequestAction } from './refs.ts'
import type { PullRequest } from './refs.ts'

const pullRequest = /\b(?:PR|pull request) #(\d+)\b/gi

export function useLinkedTitle(title: string) {
  const github = useGithubRepo()
  if (!github || !title.match(pullRequest)) return undefined
  const parts: ReactNode[] = []
  let last = 0
  for (const match of title.matchAll(pullRequest)) {
    parts.push(title.slice(last, match.index))
    parts.push(
      <a
        className="hover:underline"
        href={`https://${github}/pull/${match[1]}`}
        key={match.index}
        rel="noreferrer"
        target="_blank"
      >
        {match[0]}
      </a>,
    )
    last = match.index + match[0].length
  }
  parts.push(title.slice(last))
  return parts
}

const pullStates: Record<PullRequest['state'], string> = {
  open: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
  merged: 'bg-violet-500/12 text-violet-700 dark:text-violet-300',
  closed: 'bg-muted/60 text-muted-foreground',
}

const noChipWithoutWorktreeOrGithub = () => null

export function usePullRequestChip(id: ConversationId) {
  const [pull, setPull] = useState<PullRequest | null>()
  const askedAgainWhenTheWorkMovesOn = useConversationSummary(id)?.inputAt
  useEffect(() => {
    let live = true
    void api
      .action(PullRequestAction, { id })
      .catch(noChipWithoutWorktreeOrGithub)
      .then((value) => live && setPull(value))
    return () => {
      live = false
    }
  }, [id, askedAgainWhenTheWorkMovesOn])
  if (!pull) return undefined
  return (
    <a
      className={cn(
        'inline-flex shrink-0 items-center gap-0.5 rounded-sm px-1.5 font-mono text-[11px] leading-5 transition-opacity hover:opacity-80',
        pullStates[pull.state],
      )}
      href={pull.url}
      rel="noreferrer"
      target="_blank"
      title={`Pull request #${pull.number} (${pull.state}) on GitHub`}
    >
      PR #{pull.number}
      <ArrowUpRightIcon className="size-3 opacity-70" />
    </a>
  )
}
