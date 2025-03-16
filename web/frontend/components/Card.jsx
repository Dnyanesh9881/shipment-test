import { Layout, LegacyCard } from '@shopify/polaris'
import React from 'react'

export function Card({title, data}) {
  return (
    <>
        <Layout.Section oneThird>
            <LegacyCard title={title} sectioned>
                <h2>{data}</h2>
            </LegacyCard>
        </Layout.Section>
    </>
  )
}