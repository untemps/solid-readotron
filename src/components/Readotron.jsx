import { children, createSignal, mergeProps, onCleanup, onError, onMount, Show } from 'solid-js'
import { ReadPerMinute } from '@untemps/read-per-minute'

import interpolate from '../utils/interpolate'

const Readotron = (props) => {
	const p = mergeProps({ lang: 'en' }, props)

	let observer = null
	let parser = null

	const [getValues, setValues] = createSignal()
	const [getError, setError] = createSignal()

	const renderChildren = children(() => p.children)

	onMount(() => {
		const target = document.querySelector(p.selector)

		if (!target) {
			throw new Error(`Unable to find an element with '${p.selector}' selector`)
		}

		parser = new ReadPerMinute()
		setValues(parser.parse(target?.innerText, p.lang))

		const config = { childList: true, characterData: true, subtree: true }
		const onChange = (mutationsList) => {
			for (let mutation of mutationsList) {
				if (mutation.type === 'childList' || mutation.type === 'characterData') {
					setValues(parser.parse(target?.innerText, p.lang))
				}
			}
		}
		observer = new MutationObserver(onChange)
		observer.observe(target, config)
	})

	onCleanup(() => {
		observer.disconnect()
	})

	onError((err) => {
		setError(err)
	})

	return (
		<Show when={!getError()} fallback={p.renderError(getError())}>
			<Show
				when={!!renderChildren()}
				fallback={interpolate(
					p.template || '%time% min read',
					{ time: getValues()?.time, words: getValues()?.words },
					'%'
				)}
			>
				{renderChildren()(getValues()?.time, getValues()?.words, getError())}
			</Show>
		</Show>
	)
}

export default Readotron
