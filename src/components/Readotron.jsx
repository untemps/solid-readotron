import { children, createSignal, mergeProps, onCleanup, onError, onMount, Match, Switch } from 'solid-js'
import { ReadPerMinute } from '@untemps/read-per-minute'
import { interpolate } from '@untemps/utils/string/interpolate'

const Readotron = (props) => {
	const p = mergeProps({ template: '%time% min read', lang: 'default' }, props)

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
		setValues(parser.parse(target?.textContent, p.lang))

		const config = { childList: true, characterData: true, subtree: true }
		const onChange = (mutationsList) => {
			for (let mutation of mutationsList) {
				if (mutation.type === 'childList' || mutation.type === 'characterData') {
					setValues(parser.parse(target?.textContent, p.lang))
				}
			}
		}
		observer = new MutationObserver(onChange)
		observer.observe(target, config)
	})

	onCleanup(() => {
		observer?.disconnect()
	})

	onError((err) => {
		setError(err)
	})

	return (
		<Switch fallback={<p>Oops</p>}>
			<Match when={!!renderChildren()}>{p.children(getValues()?.time, getValues()?.words, getError())}</Match>
			<Match when={!renderChildren() && !getError()}>
				{interpolate(p.template, { time: getValues()?.time, words: getValues()?.words }, '%')}
			</Match>
		</Switch>
	)
}

export default Readotron
