import Readotron from '../Readotron'
import { cleanup, render, screen } from 'solid-testing-library'
import { waitFor } from '@testing-library/dom'

describe('Readotron', () => {
	let target

	beforeEach(() => {
		target = document.createElement('p')
		target.setAttribute('id', 'foo')
		document.body.appendChild(target)
	})

	afterEach(() => {
		cleanup()
		document.body.removeChild(target)
	})

	describe('With sync target text', () => {
		let text

		beforeEach(() => {
			text = document.createTextNode(generateTokenizedText('', 5000, 3000).str)
			target.appendChild(text)
		})

		afterEach(() => {
			target.removeChild(text)
		})

		it('renders error if target is not found', () => {
			const { container } = render(() => <Readotron selector="#bar" />)
			expect(container).toHaveTextContent('Oops')
		})

		it('renders content along with default template', () => {
			const { container } = render(() => <Readotron selector="#foo" />)
			expect(container).toHaveTextContent(/[0-9]+ min read/)
		})

		it('renders content along with custom template', () => {
			const { container } = render(() => <Readotron selector="#foo" template="foo %words% bar %time%" />)
			expect(container).toHaveTextContent(/foo\s[0-9]+\sbar\s[0-9]+/)
		})

		it('renders content along with custom children', () => {
			const { container } = render(() => (
				<Readotron selector="#foo">
					{(time, words) => (
						<span>
							foo {words} bar {time}
						</span>
					)}
				</Readotron>
			))
			expect(container).toHaveTextContent(/foo\s[0-9]+\sbar\s[0-9]+/)
		})

		it('renders content depending on the lang', () => {
			const { container: container1 } = render(() => <Readotron selector="#foo" lang="ar" />)
			const { container: container2 } = render(() => <Readotron selector="#foo" lang="it" />)
			expect(container1.textContent).not.toBe(container2.textContent)
		})

		it('updates content after target is emptied', async () => {
			const { container } = render(() => <Readotron selector="#foo" />)
			expect(container).toHaveTextContent(/[0-9]+ min read/)

			text.textContent = ''

			await waitFor(() => expect(container).toHaveTextContent('0 min read'))
		})
	})

	describe('With async target text', () => {
		it('updates content after target text has changed', async () => {
			const { container } = render(() => <Readotron selector="#foo" />)
			expect(container).toHaveTextContent('0 min read')

			const text = document.createTextNode(generateTokenizedText('', 100, 50).str)
			target.appendChild(text)

			await waitFor(() => expect(container).toHaveTextContent(/[1-9]+ min read/))
		})
	})
})
