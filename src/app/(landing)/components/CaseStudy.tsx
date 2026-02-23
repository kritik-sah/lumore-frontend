// components/CaseStudy.tsx
export default function CaseStudy() {
  return (
    <section className="py-20 px-10">
      <h3 className="text-xl font-bold text-primary mb-5">Case study</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-ui-light text-ui-shade border border-ui-shade/10 p-6 rounded-md">
            <p>
              For a national retailer, we achieved a 150% increase in sales.
            </p>
            <p className="opacity-75 mt-3">Learn more →</p>
          </div>
        ))}
      </div>
    </section>
  );
}

