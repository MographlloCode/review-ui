import { Application } from '@/types/application'

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

// MUDADO: Nome da função de getUsers para getApplications para fazer sentido
export async function getApplications(): Promise<Application[]> {
  await delay(100)

  return Array.from({ length: 2000 }, (_, i) => {
    // LÓGICA CORRIGIDA:
    // Criamos uma lista nova e única para cada iteração.
    // Assim cada aplicação tem seus próprios donos, não uma lista compartilhada.
    const mockOwners = [`dataowner${i}@email.com`, `backup_owner${i}@email.com`]

    return {
      id: i.toString(),
      application: `Application ${i}`,
      datasource: `Datasource ${i}`,
      lastScanDate: new Date().toISOString(), // Isso retorna string, batendo com a interface
      dataOwners: mockOwners,
      curationRate: Math.floor(Math.random() * 100), // Coloquei random pra ficar mais realista visualmente
      haveChangeRequest:
        i % 3 === 0 ? 'CR Reviewed By ILG' : 'Pending ILG Review',
    }
  })
}
