/** @jsxImportSource @solidjs/web */
import { Show } from 'solid-js'
import { parsePullRequest } from '@/components/ai/mentions'
import type { LinkRenderer } from '@/sdk'
import { useGithubRepo } from './ui.solid.tsx'

export const PullRequestLink: LinkRenderer = (props) => {
  const github = useGithubRepo()
  const number = () => parsePullRequest(props.href)
  return (
    <Show when={number() && github() ? number() : undefined} fallback={props.core}>
      {(found) => (
        <a
          class="font-medium text-primary underline"
          data-pull-request={found()}
          href={`https://${github()}/pull/${found()}`}
          rel="noreferrer"
          target="_blank"
        >
          {props.children}
        </a>
      )}
    </Show>
  )
}
