export const ScorecardTable = () => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Innings Header */}
      <div className="px-6 py-5 border-b">
        <h2 className="text-2xl font-semibold text-slate-900">
          Thunderbolts Innings
        </h2>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <th className="text-left px-6 py-3 font-medium">Batter</th>

            <th className="py-3 font-medium">R</th>
            <th className="py-3 font-medium">B</th>
            <th className="py-3 font-medium">4s</th>
            <th className="py-3 font-medium">6s</th>
            <th className="py-3 font-medium">SR</th>
          </tr>
        </thead>

        <tbody>
          {/* Kohli */}
          <tr className="border-t hover:bg-slate-50 transition">
            <td className="px-6 py-4">
              <div className="font-semibold text-slate-900">V. Kohli*</div>

              <div className="text-xs text-slate-500">batting</div>
            </td>

            <td className="font-semibold">74</td>
            <td>42</td>
            <td>8</td>
            <td>3</td>
            <td>176.19</td>
          </tr>

          {/* Maxwell */}
          <tr className="border-t hover:bg-slate-50 transition">
            <td className="px-6 py-4">
              <div className="font-semibold text-slate-900">G. Maxwell</div>

              <div className="text-xs text-slate-500">batting</div>
            </td>

            <td className="font-semibold">12</td>
            <td>8</td>
            <td>1</td>
            <td>1</td>
            <td>150.00</td>
          </tr>

          {/* Faf */}
          <tr className="border-t hover:bg-slate-50 transition">
            <td className="px-6 py-4">
              <div className="font-semibold text-slate-900">F. du Plessis</div>

              <div className="text-xs text-slate-500">c Smith b Khan</div>
            </td>

            <td className="font-semibold">45</td>
            <td>28</td>
            <td>4</td>
            <td>2</td>
            <td>160.71</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
