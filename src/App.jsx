import { createResource, ErrorBoundary, For, Show } from 'solid-js'
import Avatar from './assets/avatar.png'

import styles from './App.module.css'

import Readotron from '@untemps/solid-readotron'

const App = () => {
	const fetchText = async () =>
		(await fetch(`https://hipsum.co/api/?type=hipster-centric&paras=${Math.ceil(Math.random() * 50)}`)).json()

	const [paragraphs, { refetch }] = createResource(fetchText)

	return (
		<main class={styles.root}>
			<h1 class={styles.title}>Hipster Centric</h1>
			<Readotron selector="#text">
				{(time, words, error) => (
					<div class={styles.infos}>
						<span class={styles.prefix}>By</span>
						<img class={styles.avatar} src={Avatar} alt="Tera Yepeeay" />
						<span class={styles.name}>Tera Yepeeay</span>
						<span class={styles.date}>Feb 26, 2022</span>
						<Show when={!error} fallback={<span class={styles.error}>Oops</span>}>
							<span class={styles.readotron}>
								{time} min read ({words} words)
							</span>
						</Show>
					</div>
				)}
			</Readotron>
			<div class={styles.refresh}>
				<button onClick={refetch}>Refresh text</button>
			</div>
			<hr class={styles.separator} />
			<ErrorBoundary fallback={<span class={styles.error}>Oops, we're unable to load the content</span>}>
				<article id="text" class={styles.text}>
					<For each={paragraphs()}>{(item) => <p>{item}</p>}</For>
				</article>
			</ErrorBoundary>
		</main>
	)
}

export default App
